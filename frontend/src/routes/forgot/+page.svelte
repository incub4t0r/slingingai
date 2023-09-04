<style>
    .centered {
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .main {
        height: 100vh; 
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
        <div class="card-body mb-2">
            <h1 class="card-title mb-4">Forgot your password?</h1>
            <p>
                Please reach out to the admin, and they will help retrieve your password.
            </p>
            <p class="mb-4">
                If you have no idea who the admin is, you shouldn't be here.
                Click <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">here</a> to reach out to the admin.
            </p>
            <a href="/" class="btn btn-primary w-100">Return to login</a>
        </div>
    </div>
</div>
