var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    price: PRICE,
    newSearch: 'anime',
    lastSearch: '',
    loading: false
  },
  computed: {
    noMoreItems: function() {
      return this.results.length === this.items.length && this.results.length > 0;
    }
  },
  watch: {
    cart: {
      handler: function(val) {
        this.$http.post('/cart-update', val)
      },
      deep: true

    }
  },
  methods: {
    appendItems: function() {
      if(this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      if(this.newSearch.length) {
        this.items = [];
        this.loading = true;
        this.$http.get('/search/'.concat(this.newSearch))
        .then(function(res) {
          this.lastSearch = this.newSearch;
          this.results = res.data;
          this.appendItems();
          this.loading = false;
        });
      }
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
  },
  mounted: function() {
    this.onSubmit();

    // Scroll reveal for product list.
    var _vueinstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);

    watcher.enterViewport(function() {
      _vueinstance.appendItems();
    });
  }
});
