const LoginTemplate = `
    <div class="auth">
        <h3>Log In</h3>
        <form action="POST" @submit.prevent="loginUser">
          <label for="email">Email Address</label>
          <input type="email" name="email"  placeholder="youremail@something.com"/>
          <label for="password">Password</label>
          <input type="password" name="password" placeholder="password" />
          <button class="auth-submit">submit</button>
        </form>
    </div>
`

export { LoginTemplate }