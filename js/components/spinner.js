import { h, render, Component } from 'preact';

/**
 * Кнопка со спиннером
 * @todo Сделать просто спиннер
 */
export default class Spinner extends Component {
  render() {
    return (
      <button class="button button_primary" disabled>
        <span class="spinner"></span>
        <span>Загрузка</span>
      </button>
    )
  }
}