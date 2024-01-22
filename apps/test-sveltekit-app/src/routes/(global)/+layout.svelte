<script lang="ts">
  // import '$lib/styles/app.scss';

  // import { getContext, setContext } from 'svelte';
  // import { partytownSnippet } from '@builder.io/partytown/integration';
  // import nightwind from 'nightwind/helper';
  // import { onMount } from 'svelte';
  import {
    //  type Writable,
    writable,
  } from 'svelte/store';

  import { dev } from '$app/environment';
  import { ContextStore } from '$lib/stores/ContextStore';
  // import { ContextStore } from '$lib/stores/ContextStore';
  // import { createContext } from '../../lib/utils/context';
  // import { onNavigate } from '$app/navigation';

  const x = 3;
  console.log(x);

  /**
   * ! IMP!: Context and stores, prevent global state and data leaks
   */
  // create safe stores to avoid global shared state and data leaks
  const user = writable({
    name: 'mark',
    age: 32,
  });
  // method 1 - typescript problems, no type safe
  // setContext('user', user);
  // // access it on all children components
  // const userStore = getContext('user');
  // $: console.log($userStore.name);

  // method 2 - NOT DRY, repeating types
  // const context = createContext<Writable<string>>(Symbol('context'));
  // context.set(writable('data'));
  // const store = context.get();
  // $: console.log($store);

  // method 3: create the base context fn to prevent repeating types and be typesafe
  // it preset the name of the context and its type
  ContextStore.set(user);
  const safeStore = ContextStore.get();
  console.log($safeStore.age);

  // #######

  // // Add the Partytown script to the DOM head
  // let scriptElementPartyTown: HTMLScriptElement;
  // let scriptElementNightWind: HTMLScriptElement;
  // onMount(() => {
  //   scriptElementPartyTown.textContent = partytownSnippet();
  //   scriptElementNightWind.textContent = nightwind.init();
  // });

  // // new web transitions
  // onNavigate(async (navigation) => {
  //   if (!(Object.keys(document.startViewTransition).length >= 0)) return;

  //   return new Promise((resolve) => {
  //     document.startViewTransition(async () => {
  //       resolve();
  //       await navigation.complete;
  //     });
  //   });
  // });
</script>

<!-- <svelte:head> -->
<!--   <script bind:this={scriptElementPartyTown}></script> -->
<!--   <script bind:this={scriptElementNightWind}></script> -->
<!-- </svelte:head> -->

<!-- <button on:click={() => nightwind.toggle()}>toggle theme</button> -->

<slot />

{#if dev}
  <!-- ! tailwind breakpoint -->
  <div
    class="text-pink-600 bg-gray-300 border-gray-400 fixed bottom-0 right-0 m-2 flex items-center rounded border p-2 text-sm"
  >
    <svg
      class="inline h-6 w-auto"
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="url(#paint0_linear)"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M32 16C24.8 16 20.3 19.6 18.5 26.8C21.2 23.2 24.35 21.85 27.95 22.75C30.004 23.2635 31.4721 24.7536 33.0971 26.4031C35.7443 29.0901 38.8081 32.2 45.5 32.2C52.7 32.2 57.2 28.6 59 21.4C56.3 25 53.15 26.35 49.55 25.45C47.496 24.9365 46.0279 23.4464 44.4029 21.7969C41.7557 19.1099 38.6919 16 32 16ZM18.5 32.2C11.3 32.2 6.8 35.8 5 43C7.7 39.4 10.85 38.05 14.45 38.95C16.504 39.4635 17.9721 40.9536 19.5971 42.6031C22.2443 45.2901 25.3081 48.4 32 48.4C39.2 48.4 43.7 44.8 45.5 37.6C42.8 41.2 39.65 42.55 36.05 41.65C33.996 41.1365 32.5279 39.6464 30.9029 37.9969C28.2557 35.3099 25.1919 32.2 18.5 32.2Z"
      >
      </path>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="3.5"
          y1="16"
          x2="59"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2298BD"></stop>
          <stop offset="1" stop-color="#0ED7B5"></stop>
        </linearGradient>
      </defs>
    </svg>
    Current breakpoint
    <span class="ml-1 sm:hidden md:hidden lg:hidden xl:hidden"
      >default (&lt; 640px)</span
    >
    <span class="ml-1 hidden font-extrabold sm:inline md:hidden">sm</span>
    <span class="ml-1 hidden font-extrabold md:inline lg:hidden">md</span>
    <span class="ml-1 hidden font-extrabold lg:inline xl:hidden">lg</span>
    <span class="ml-1 hidden font-extrabold xl:inline">xl</span>
  </div>
{/if}

<style lang="scss">
  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  @keyframes slide-from-right {
    from {
      transform: translateX(30px);
    }
  }

  @keyframes slide-to-left {
    to {
      transform: translateX(-30px);
    }
  }

  :root::view-transition-old(root) {
    animation:
      90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
      300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
  }

  :root::view-transition-new(root) {
    animation:
      210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
      300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
  }

  // [https://svelte.dev/blog/view-transitions]
  // header {
  //     // Now, the header will not transition in and out on navigation, but the rest of the page will.
  //     display: flex;
  //     justify-content: space-between;
  //     view-transition-name: header;
  //  a view-transition-name acts as a unique identifier so the browser can
  //  identify matching elements from the old and new states.
  // }

  //     Inside src/routes/Header.svelte, find the CSS rule creating the active page indicator and give it a view-transition-name:
  // li[aria-current='page']::before {
  // 	/* other existing rules */
  // 	view-transition-name: active-page;
  // }
  // By adding that single line, the indicator will now smoothly slide to its new position instead of jumping.

  // to disable for users with reduced motion
  //    @media (prefers-reduced-motion) {
  // ::view-transition-group(*),
  // ::view-transition-old(*),
  // ::view-transition-new(*) {
  // 	animation: none !important;
  // }
  // }
</style>
