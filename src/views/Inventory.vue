<template>
  <crud-products/>
</template>

<script>
import CrudProducts from '../components/ProductsCRUD.vue'
  export default {
    name: 'Products',

    components: {
        CrudProducts,
    },
  }
</script>