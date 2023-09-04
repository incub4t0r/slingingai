<!-- Layout.svelte -->
<script>
    import { page } from "$app/stores";
    const navLinks = [
        { text: "Home", href: "/" },
        { text: "History", href: "/history" },
    ];
    const menuLinks = [
        { text: "Settings", href: "/settings" },
    ]
    import ProtectedRoute from '$lib/ProtectedRoute.svelte';
    import { setAuthenticated } from "$lib/auth";
</script>
<!-- <style>
    .active {
        color: red !important;
    }
</style> -->
<ProtectedRoute>
    <header>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/"><i class="bi bi-file-earmark"></i></a>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon" />
                </button>
                <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul class="navbar-nav">
                        {#each navLinks as link}
                        <li class="nav-item">
                            <a
                                class="nav-link"
                                href={link.href}
                                class:active={$page.route.id === link.href}
                                aria-current={$page.route.id === link.href ? "page" : null}
                            >
                                {link.text}
                            </a>
                        </li>
                        {/each}
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Menu
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-2">
                                {#each menuLinks as link}
                                    <li>
                                        <a class="dropdown-item" href={link.href}>{link.text}</a>
                                    </li>
                                {/each}
                                <li>
                                    <button class="btn btn-outline-danger w-100" on:click={() => setAuthenticated(false)}>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    
    <main>
        <slot />
    </main>
</ProtectedRoute>
