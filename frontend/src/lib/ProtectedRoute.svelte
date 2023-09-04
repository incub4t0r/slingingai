<!-- ProtectedRoute.svelte -->
<script>
    import { isAuthenticated, setAuthenticated } from "./auth.js";
    import { onMount } from "svelte";
    import LoginForm from "./LoginForm.svelte";
    let loading = true; // Initial loading state

    onMount(() => {
        setTimeout(() => {
            loading = false;
        }, 0); // Simulate authentication check delay (remove this in production)
    });
</script>

{#if loading}
    <p>Loading...</p>
{:else if $isAuthenticated}
    <slot />
{:else}
    <LoginForm />
{/if}
