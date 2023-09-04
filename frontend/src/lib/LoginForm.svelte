<script>
    import {setAuthenticated} from "$lib/auth.js"
    let username = '';
    let password = '';
    let checkingLogin = false;

    async function handleLogin() {
        checkingLogin = true; // Set to true when login begins
        if (username === 'test' && password === 'test') {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate login delay (remove this in production)
            setAuthenticated(true);
        } else {
            alert('Incorrect username or password');
            checkingLogin = false; // Set back to false when login fails
        }
    }
</script>

<style>
    .centered {
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .main {
        height: 100vh; /* Default height for larger screens */
        width: 40vw;
        /* Media query for iPhones or devices with smaller screen heights */
        @media screen and (max-height: 700px) {
            width: 100vw;
            height: -webkit-fill-available; /* iOS Safari */
            height: fill-available; /* Modern browsers */
        }
    }
</style>

<div class="container-lg main centered">
    <div class="card w-100">
        <div class="card-body">
            <h1 class="card-title mb-4">Welcome back</h1>
            {#if checkingLogin}
                <p>Checking login...</p>
            {:else}
                <form on:submit={handleLogin}>
                    <div class="form-floating mb-2">
                        <input bind:value={username} type="text" class="form-control" id="username" placeholder="">
                        <label for="username" class="text-muted">Username</label>
                    </div>
                    <div class="form-floating mb-2">
                        <input bind:value={password} type="password" class="form-control" id="password" placeholder="">
                        <label for="password" class="text-muted">Password</label>
                    </div>
                    <button type="submit" class="mt-4 mb-4 btn btn-primary w-100">Login</button>
                </form>
                <div class="d-flex justify-content-between mb-2">
                    <a href="/register" class="btn btn-outline-secondary w-50 mt-2 me-2">Register</a>
                    <a href="/forgot" class="btn btn-outline-secondary w-50 mt-2 ms-2">Forgot password</a>
                </div>
            {/if}
        </div>
    </div>
</div>
