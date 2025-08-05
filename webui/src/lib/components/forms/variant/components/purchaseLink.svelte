<script>
  import { writable } from "svelte/store";
  import PurchaseCheck from "./purchaseCheck.svelte";
  import PurchaseTextField from "./purchaseTextField.svelte";
  import { onMount } from "svelte";

  export let link, purchaseIndex, sizeIndex, removePurchaseLink;
  let localLink = writable({});

  onMount(() => {
    localLink.set(structuredClone(link));
  });

  localLink.subscribe((value) => {
    // If this print statement is removed links completely break...
    console.log("changing link from: ", link, "to: ", value);
    link = value;
  });
</script>

<div
  class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-2 bg-gray-50 dark:bg-gray-800">
  <div class="flex justify-between items-center mb-4">
    <h4 class="font-medium text-gray-700 dark:text-gray-300">
      Purchase Link {purchaseIndex + 1}
    </h4>
      <button
        type="button"
        onclick={removePurchaseLink}
        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
  </div>

  <div class="space-y-4">
    <!-- TODO: Replace with dropdown ones store infra exists -->
    <PurchaseTextField
      id="sizes_{sizeIndex}_store_id_{purchaseIndex}"
      title="Store ID"
      placeholder="amazon-us"
      bind:formVar={$localLink.store_id}
      required={true}
    />

    <PurchaseTextField
      id="sizes_{sizeIndex}_url_{purchaseIndex}"
      title="Purchase URL"
      placeholder="https://www.store.com/product/12345"
      bind:formVar={$localLink.url}
      required={true}
    />

    <div class="grid grid-cols-2 gap-3">
      <PurchaseCheck
        id="sizes_{sizeIndex}_affiliate_{purchaseIndex}"
        title="Affiliate link"
        bind:formVar={$localLink.affiliate}
        required={true}
      />

      <PurchaseCheck
        id="sizes_{sizeIndex}_spool_refill_{purchaseIndex}"
        title="Is spool refill"
        bind:formVar={$localLink.spool_refill}
      />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <PurchaseTextField
        id="sizes_{sizeIndex}_ships_from_{purchaseIndex}"
        title="Ships from"
        placeholder="US"
        bind:formVar={$localLink.ships_from}
      />

      <PurchaseTextField
        id="sizes_{sizeIndex}_ships_to_{purchaseIndex}"
        title="Ships to"
        placeholder="EU"
        bind:formVar={$localLink.ships_to}
      />
    </div>
  </div>
</div>