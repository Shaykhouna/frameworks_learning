import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Profile")
    }

    async getHtml() {
        return `
            <h1>Welcome back, Dom</h1>
            <p>
                You are Viewing the Posts
            </p>
            <p>
                <a href="/posts" data-link>View recent posts</a>.
            </p>
        `;
    }
}