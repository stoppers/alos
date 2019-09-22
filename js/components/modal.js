import { Component, h, render } from "preact";

export class Modal extends Component {
  state = { openModal: true }

  onClose = e => {
    e.preventDefault();
    this.setState({ openModal: false })
  }

  open(open) {
    if (open) {
      this.setState({ openModal: open })
      return open;
    }
  }

  render({ children, open, title }, { openModal }) {
    if (open && openModal) {
      return (
        <div class="modal modal_open">
          <Dialog>
            {title && (<div class="modal__header">
              <h5 class="modal__title">{title}</h5>
              <button type="button" onClick={this.onClose} class="modal-close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>)}
            {children}
          </Dialog>
        </div>
      )
    }
  }
}

export class Content extends Component {
  render({ children }) {
    return (
      <div class="modal__content">
        {children}
      </div>
    )
  }
}

export class Dialog extends Component {
  render({ children }) {
    return (
      <div class="modal__dialog">
        <Content>{children}</Content>
      </div>
    )
  }
}

export class Header extends Component {
  close = e => {
  }

  render({ title, state }) {
    return (
      <div class="modal__header">
        <h5 class="modal__title">{title}</h5>
        <button type="button" class="modal-close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
    )
  }
}

export class Body extends Component {
  render({ children }) {
    return (
      <div class="modal__body">
        {children}
      </div>
    )
  }
}

export class Footer extends Component {
  render({ children }) {
    return (
      <div class="modal__footer">
        {children}
      </div>
    )
  }
}