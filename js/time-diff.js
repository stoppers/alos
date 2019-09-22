const SEC_ARRAY = [60, 60, 24, 7, 365/7/12, 12];

/**
 * change f into int, remove decimal. Just for code compression
 * @param f
 * @returns {number}
 */
const toInt = f => parseInt(f);

/**
 * format Date / string / timestamp to Date instance.
 * @param input
 * @returns {*}
 */
const toDate = input => {
  if (input instanceof Date) return input;
  if (!isNaN(input) || /^\d+$/.test(input)) return new Date(toInt(input));
  input = (input || '').trim().replace(/\.\d+/, '') // remove milliseconds
    .replace(/-/, '/').replace(/-/, '/')
    .replace(/(\d)T(\d)/, '$1 $2').replace(/Z/, ' UTC') // 2017-2-5T3:57:52Z -> 2017-2-5 3:57:52UTC
    .replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2'); // -04:00 -> -0400
  return new Date(input);
};

/**
 * format the diff second to *** time ago, with setting locale
 * @param diff
 * @param localeFunc
 * @returns {string | void | *}
 */
const formatDiff = (diff, localeFunc) => {
  // if locale is not exist, use defaultLocale.
  // if defaultLocale is not exist, use build-in `en`.
  // be sure of no error when locale is not exist.
  let i = 0,
    agoin = diff < 0 ? 1 : 0, // timein or timeago
    total_sec = diff = Math.abs(diff);

  for (; diff >= SEC_ARRAY[i] && i < SEC_ARRAY.length; i++) {
    diff /= SEC_ARRAY[i];
  }
  diff = toInt(diff);
  i *= 2;

  if (diff > (i === 0 ? 9 : 1)) i += 1;
  return localeFunc(diff, i, total_sec)[agoin].replace('%s', diff);
};

/**
 * calculate the diff second between date to be formatted an now date.
 * @param date
 * @param nowDate
 * @returns {number}
 */
const diffSec = (date, nowDate) => {
  nowDate = nowDate ? toDate(nowDate) : new Date();
  return (nowDate - toDate(date)) / 1000;
};

/**
 * nextInterval: calculate the next interval time.
 * - diff: the diff sec between now and date to be formatted.
 *
 * What's the meaning?
 * diff = 61 then return 59
 * diff = 3601 (an hour + 1 second), then return 3599
 * make the interval with high performance.
 **/
const nextInterval = diff => {
  let rst = 1, i = 0, d = Math.abs(diff);
  for (; diff >= SEC_ARRAY[i] && i < SEC_ARRAY.length; i ++) {
    diff /= SEC_ARRAY[i];
    rst *= SEC_ARRAY[i];
  }
  d = d % rst;
  d = d ? rst - d : rst;
  return Math.ceil(d);
};

const ATTR_TIMEAGO_TID = 'timeago-tid';
const ATTR_DATETIME = 'datetime';

/**
 * get the node attribute, native DOM and jquery supported.
 * @param node
 * @param name
 * @returns {*}
 */
const getAttribute = (node, name) => {
  if (node.getAttribute) return node.getAttribute(name); // native dom
  if (node.attr) return node.attr(name); // jquery dom
};

/**
 * get the datetime attribute, `data-timeagp` / `datetime` are supported.
 * @param node
 * @returns {*}
 */
const getDateAttribute = node => getAttribute(node, ATTR_DATETIME);

/**
 * set the node attribute, native DOM and jquery supported.
 * @param node
 * @param timerId
 * @returns {*}
 */
const saveTimerId = (node, timerId) => {
  if (node.setAttribute) return node.setAttribute(ATTR_TIMEAGO_TID, timerId);
  if (node.attr) return node.attr(ATTR_TIMEAGO_TID, timerId);
};

const getTimerId = node => getAttribute(node, ATTR_TIMEAGO_TID);

const TimerPool = {};

const clear = tid => {
  clearTimeout(tid);
  delete TimerPool[tid];
};


const run = (node, date, localeFunc, nowDate) => {
  clear(getTimerId(node));

  // get diff seconds
  const diff = diffSec(date, nowDate);
  // render
  node.innerText = formatDiff(diff, localeFunc);

  const tid = setTimeout(() => {
    run(node, date, localeFunc, nowDate);
  }, nextInterval(diff) * 1000, 0x7FFFFFFF);

  // there is no need to save node in object. Just save the key
  TimerPool[tid] = 0;
  saveTimerId(node, tid);
};


/**
 * LOCALE
 * @param {*} node 
 */
var seconds = formatNum.bind(null, '1 секунду', '%s секунду', '%s секунды', '%s секунд'),
  minutes = formatNum.bind(null, '1 минуту', '%s минуту', '%s минуты', '%s минут'),
  hours = formatNum.bind(null, '1 час', '%s час', '%s часа', '%s часов'),
  days = formatNum.bind(null, '1 день', '%s день', '%s дня', '%s дней'),
  weeks = formatNum.bind(null, '1 неделю', '%s неделю', '%s недели', '%s недель'),
  months = formatNum.bind(null, '1 месяц', '%s месяц', '%s месяца', '%s месяцев'),
  years = formatNum.bind(null, '1 год', '%s год', '%s года', '%s лет');

  /**
 *
 * @param f1 - 1
 * @param f - 21, 31, ...
 * @param s - 2-4, 22-24, 32-34 ...
 * @param t - 5-20, 25-30, ...
 * @param n
 * @returns {string}
 */
function formatNum(f1, f, s, t, n) {
  var n10 = n % 10,
    str = t;

  if (n === 1) {
    str = f1;
  } else if (n10 === 1 && n > 20) {
    str = f;
  } else if (n10 > 1 && n10 < 5 && (n > 20 || n < 10)) {
    str = s;
  }
  
  return str;
}

function Locale(number, index) {
  switch(index) {
    case 0: return ['только что', 'через несколько секунд'];
    case 1: return [seconds(number) + ' назад', 'через ' + seconds(number)];
    case 2: // ['минуту назад', 'через минуту'];
    case 3: return [minutes(number) + ' назад', 'через ' + minutes(number)];
    case 4: // ['час назад', 'через час'];
    case 5: return [hours(number) + ' назад', 'через ' + hours(number)];
    case 6: return ['вчера', 'завтра'];
    case 7: return [days(number) + ' назад', 'через ' + days(number)];
    case 8: // ['неделю назад', 'через неделю'];
    case 9: return [weeks(number) + ' назад', 'через ' + weeks(number)];
    case 10: // ['месяц назад', 'через месяц'];
    case 11: return [months(number) + ' назад', 'через ' + months(number)];
    case 12: // ['год назад', 'через год'];
    case 13: return [years(number) + ' назад', 'через ' + years(number)];
    default: return ['', '']
  }
};


const cancel = node => {
  if (node) clear(getTimerId(node)); // get the timer of DOM node(native / jq).
  else for (const tid in TimerPool) clear(tid);
};

const render = (nodes, locale, nowDate) => {
  // by .length
  if (nodes.length === undefined) nodes = [nodes];

  nodes.forEach(node => {
    const date = getDateAttribute(node);
    run(node, date, Locale, nowDate);
  })

  return nodes;
};

const format = (date, nowDate) => {
  // diff seconds
  const sec = diffSec(date, nowDate);
  // format it with locale
  return formatDiff(sec, Locale);
};

document.querySelectorAll('time[data-time-diff]').forEach(elem => {
  const datetimeAttr = getAttribute(elem, 'datetime')
  elem.textContent = format(datetimeAttr)
})