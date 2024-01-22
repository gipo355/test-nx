<script lang="ts">
  export let style: 'primary' | 'secondary' = 'primary';
  export let type: 'reset' | 'button' | 'submit' = 'button';
  export let disabled = false;
</script>

<button class={style} {type} {disabled}>
  <slot />
</button>

<style lang="scss">
  button {
    width: 100px;
    height: 40px;
    border: 0;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
  }

  .primary {
    background-color: #202142;
  }

  .secondary {
    background: #ff6a95;
  }

  button:hover {
    opacity: 0.9;
    transform: scale(0.98);
  }

  button:disabled {
    background-color: #ccc;
    color: #333;
    cursor: auto;
  }
</style>
