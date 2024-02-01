<template>
    <div :class="pageClass">
        <div class="login-box">
            <h2>Login</h2>
            <form ref="loginForm" @submit.prevent="loginUser">
                <div class="user-box log-status">
                    <input class="form-control" type="text" v-model="username" name="" required="">
                    <label>Username / Mail</label>
                </div>
                <div class="user-box log-status">
                    <input class="form-control" type="password" v-model="password" name="" required="">
                    <label>Password</label>
                </div>
                <div>
                    <span class="alert">Invalid Credentials</span>
                </div>
                <div>
                    <a class="log-btn" @click="loginUser">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Login
                    </a>
                </div>
            </form>
        </div>
    </div>
</template>
  
<script>
import { Base64 } from 'js-base64';
export default {
    data() {
        return {
            username: '',
            password: '',
            errorMessage: ''
        };
    },
    methods: {
        async loginUser() {
            try {
                // const encoder = new TextEncoder();
                // const utf8Bytes = encoder.encode(`${this.username}:${this.password}`);
                const credentials = Base64.encode(`${this.username}:${this.password}`)

                // const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');//`${btoa(this.username)}:${btoa(this.password)}`;
                const token = await this.$store.dispatch('auth/login', { username: this.username, password: this.password, credentials: credentials });
                console.log(token.status)
                if (token.status == 200) {
                    // Redirect to dashboard
                    this.$router.push('dashboard');
                } else {
                    const logStatus = document.querySelectorAll('.log-status');
                    const alertBox = document.querySelector('.alert');
                    alertBox.innerHTML = token.error

                    logStatus.forEach(element => {
                        element.classList.add('wrong-entry');
                    })
                    alertBox.style.display = 'block';
                    setTimeout(() => {
                        alertBox.style.display = 'none';
                    }, 3000);
                    this.errorMessage = 'Invalid username or password';
                    const formControls = document.querySelectorAll('.form-control');
                    formControls.forEach(control => {
                        control.addEventListener('keypress', function () {
                            logStatus.forEach(element => {
                                element.classList.remove('wrong-entry');
                            })
                        });
                    });
                    this.errorMessage = 'Invalid username or password';
                }
            } catch (error) {
                console.error('Login error:', error);
                this.errorMessage = 'An error occurred during login. Please try again later.';
            }
        },
    },
    computed: {
        pageClass() {
            const routeName = this.$route.name;

            import(`@/assets/login.css`);
        }
    }
};
</script>

<style></style>
  