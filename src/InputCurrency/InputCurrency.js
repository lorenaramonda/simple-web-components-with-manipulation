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

    

    console.log("hello!");
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
            "num"
        ];
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
        return this.hasAttribute("error");
    }

    set error (newValue) {
        if (newValue) {
            this.setAttribute("error", "");
        } else {
            this.removeAttribute("error");
        }
    }

    connectedCallback () {
        this.render();
    }

    setValue(input){
        if(this.num){
            input.value = toCurrency(this.num);
        }
    }

    setError(input){
        if(this.error){
            input.classList.add("input-style1-danger");
        }else{
            input.classList.remove("input-style1-danger");
        }
    }

    setDisabled(input){
        input.disabled = this.disabled;
    }

    attributeChangedCallback (name) {
        window.requestAnimationFrame(() => {
            const input = this.querySelector("input");

            if(!input){
                return;
            }

            switch(name){
            case "num":
                return this.setValue(input);
            case "error":
                return this.setError(input);
            case "disabled":
                return this.setDisabled(input);
            }
        });
    }

    render () {

        const child = domUtils.htmlToDomElement(template);
        const domInputElement = child.querySelector("input");

        this.setDisabled(domInputElement);
        this.setError(domInputElement);
        this.setValue(domInputElement);
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