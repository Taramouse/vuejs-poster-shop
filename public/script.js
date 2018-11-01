var PRICE = 9.99;
new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    newSearch: '',
    lastSearch: '',
    loading: false
  },
  methods: {
    onSubmit: function() {
      this.items = [];
      this.loading = true;
      this.$http.get('/search/'.concat(this.newSearch))
      .then(function(res) {
        this.lastSearch = this.newSearch;
        this.items = res.data;
        this.loading = false;
      });
    },
    addItem: function(index) {
      // console.log(index);
      this.total += PRICE;
      // this.cart.push(this.items[index]);
      var item = this.items[index];
      var found = false;
      for(var i = 0; i < this.cart.length; i++) {
        if(this.cart[i].id === item.id) {
          found = true;
          this.cart[i].qty++;
          break;
        }
      }
      if(!found) {
          this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        });
      }
    },
    inc: function(item) {
      item.qty++;
      this.total += PRICE;
    },
    dec: function(item) {
      item.qty--;
      this.total -= PRICE;
      if(item.qty <= 0) {
        for(var i = 0; i < this.cart.length; i++) {
          if(this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function(price) {
      return '£'.concat(price.toFixed(2));
    }
  }
});
