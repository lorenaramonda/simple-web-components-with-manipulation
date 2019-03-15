import template from "./CollapseButton.tpl.html";
import domUtils from "../utils/domUtils";

class CollapseButton extends HTMLElement {

  static get observedAttributes () {
      return [
          "text"
      ];
  }

  get text () {
    return this.getAttribute("text");
  }

  set text(newText) {
      this.setAttribute("text", newText);
  }

  setText(span) {
      if(this.text) {
          span.innerText = this.text;
      } else {
          span.innerText = "";
      }
  }
  
  connectedCallback () {
    this.render();
  }
  
  render () {
    const child = domUtils.htmlToDomElement(template);
    const domSpanElement = child.querySelector("span");
    this.setText(domSpanElement);
    this.appendChild(child);
  }

}

export default CollapseButton;