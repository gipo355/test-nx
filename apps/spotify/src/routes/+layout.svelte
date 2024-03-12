<script lang="ts">
  // tailwind layout
  import '$lib/styles/app.scss';

  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/login">Login</a></li>
  </ul>
</nav>
Hello {data.user?.name === undefined ? '' : data.user?.name}

<slot />

<style lang="scss">
  nav {
    padding: 1rem;

    ul {
      display: flex;
      padding: 0;
      margin: 0;
      list-style: none;

      li {
        margin-right: 1rem;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
