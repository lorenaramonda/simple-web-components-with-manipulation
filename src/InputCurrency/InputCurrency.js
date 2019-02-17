import template from "./InputCurrency.tpl.html";
import domUtils from "../utils/domUtils";
import { toNumber, toCurrency } from "../utils/utils";

const emitChangeValue = (element) => {
    
    const event = new window.CustomEvent("value-change", {
        detail: () => Number.parseFloat(element.value),
        bubbles: true
    });

    element.dispatchEvent(event);
};

const bindInputEvents = (element, input) => {

    input.addEventListener("blur", () => {
        const transformedInput = input.value.replace(/\D,/g, "");
        const sanitizedInput = !isNaN(parseFloat(transformedInput)) ? transformedInput : "0";
        const floatInputWithTwoDecimals = toNumber(sanitizedInput).toFixed(2);
        const stringInputWithTwoDecimals = toCurrency(floatInputWithTwoDecimals);
        input.value = toNumber(stringInputWithTwoDecimals);
        emitChangeValue(input);
        element.num = toNumber(stringInputWithTwoDecimals);
    });

    input.addEventListener("focus", () => {
        let myValue = null;

        if (input.value == "0,00") {
            myValue = "";
        } else {
            myValue = input.value.split(".").join("");
        }

        input.value = myValue;

    });
};

class InputCurrency extends HTMLElement {
    static get observedAttributes () {
        return [
            "disabled",
            "error",
            "num",
            "label"
        ];
    }

    get label () {
        return this.getAttribute("label");
    }

    set label(newValue) {
        this.setAttribute("label", newValue);
    }

    get num () {
        return this.getAttribute("num");
    }

    set num(newValue) {
        this.setAttribute("num", newValue);
    }

    get disabled () {
        return this.hasAttribute("disabled");
    }

    set disabled (newDisabled) {
        if (newDisabled) {
            this.setAttribute("disabled", "");
        } else {
            this.removeAttribute("disabled");
        }
    }

    get error () {
        return this.getAttribute("error");
    }

    set error (newValue) {
        this.setAttribute("error", newValue);
    }

    connectedCallback () {
        this.render();
    }

    setValue(input){
        if(this.num){
            input.value = toCurrency(this.num);
        }
    }

    setLabel(label){
        if(this.label){
            label.innerText = this.label;
        }else{
            label.innerText = "";
        }
    }

    setError(input, error){

        if(this.error){
            input.classList.add("mds-input-currency__input--error");
            error.innerText = this.error;
        }else{
            input.classList.remove("mds-input-currency__input--error");
            error.innerText = "";
        }
    }

    setDisabled(input){
        input.disabled = this.disabled;
    }

    attributeChangedCallback (name) {
        window.requestAnimationFrame(() => {
            const input = this.querySelector("input");
            const label = this.querySelector("label");
            const error = this.querySelector(".mds-input-currency__error");

            if(!input){
                return;
            }

            switch(name){
            case "num":
                return this.setValue(input);
            case "label":
                return this.setLabel(label);
            case "error":
                return this.setError(input, error);
            case "disabled":
                return this.setDisabled(input);
            }
        });
    }

    render () {

        const child = domUtils.htmlToDomElement(template);
        const domInputElement = child.querySelector("input");
        const domLabelElement = child.querySelector("label");
        const domErrorElement = child.querySelector(".mds-input-currency__error");

        this.setDisabled(domInputElement);
        this.setError(domInputElement, domErrorElement);
        this.setValue(domInputElement);
        this.setLabel(domLabelElement);
        bindInputEvents(this, domInputElement);

        domUtils.nextTick().then(() => {
            //Always append at the end of render
            if(this.firstChild){
                this.replaceChild(child, this.firstChild);
            }else{
                this.appendChild(child);
            }
        });

    }
}

export default InputCurrency;