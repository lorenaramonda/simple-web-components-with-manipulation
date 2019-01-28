const htmlToDomElement = html => {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstChild;
};

const nextTick = () => new Promise(resolve => {
    window.requestAnimationFrame(resolve);
});

export default {
    htmlToDomElement,
    nextTick
};