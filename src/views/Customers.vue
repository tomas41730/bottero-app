<template>
  <crud-customers/>
</template>

<script>
import CrudCustomers from '../components/CustomersCRUD.vue'
  export default {
    name: 'Customers',

    components: {
        CrudCustomers,
    },
  }
</script>
