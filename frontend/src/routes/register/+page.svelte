<script>
    let username = "";
    let password = "";
    let confirm_password = "";
    let registration_token = "";

    let confirmOutlineColor = ""; // Initialize the outline color variable

    function typing_check_password() {
        if (password.length > 0 ){
            if (confirm_password == password) {
                confirmOutlineColor = "green";
            } else {
                confirmOutlineColor = "red";
            }
        }
        else {
            confirmOutlineColor = "";
        }
    }

    $: {
        console.log(username, password, confirm_password);
        typing_check_password();
    }

    function handleRegistration(){
        // TODO: check if registration token is valid
        if (confirm_password == password) {
            alert("passwords match, next step is check registration token");
        }
        else {
            alert("Passwords do not match");
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
        <div class="card-body">
            <h1 class="card-title mb-4">Please register</h1>
                <form on:submit={handleRegistration}>
                    <div class="form-floating mb-4">
                        <input bind:value={username} type="text" class="form-control" id="username" placeholder="">
                        <label for="username" class="text-muted">Username</label>
                    </div>
                    <div class="form-floating mb-2">
                        <input bind:value={password} type="password" class="form-control" id="password" placeholder="">
                        <label for="password" class="text-muted">Password</label>
                    </div>
                    <div class="form-floating mb-4">
                        <input bind:value={confirm_password} type="password" class="form-control" id="confirm_password" placeholder="" style="border-color: {confirmOutlineColor};">
                        <label for="confirm_password" class="text-muted">Confirm Password</label>
                    </div>
                    <div class="form-floating mb-2">
                        <input bind:value={registration_token} type="password" class="form-control" id="registration_token" placeholder="">
                        <label for="registration_token" class="text-muted">Registration Token</label>
                    </div>
                    
                    <button type="submit" class="mt-4 mb-2 btn btn-primary w-100">Register</button>
                </form>
        </div>
    </div>
</div>
