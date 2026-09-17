class SettingsMenu extends HTMLElement {
    async connectedCallback() {
        const response = await fetch("components/settings.html");
        this.innerHTML = await response.text();
    };
};

customElements.define("settings-menu", SettingsMenu);