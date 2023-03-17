var app = new Vue({
  el: '#app',
  data: {
      shopName: 'NoName Shop',
      products: [
          {
              id: 0,
              title: "iPhone 11",
              brand: "Apple",
              price: 34900,
              is_favorite: false,
              color: ['green', 'blue', 'red'],
              image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
              quantity: 0
          },
          {
              id: 1,
              title: "Lumix GH5",
              brand: "Panasonic",
              price: 44900,
              is_favorite: false,
              color: ['green', 'blue', 'red'],
              quantity: 0,
              image: 'https://images.unsplash.com/photo-1585459733441-9b415fed25b3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80'
          },
          {
              id: 2,
              title: "Vintage Model Car",
              brand: "Unknow",
              price: 990,
              is_favorite: false,
              color: ['green', 'blue', 'red'],
              quantity: 0,
              image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
          },
          {
              id: 3,
              title: "Case for iPhone 11 Pro",
              brand: "Unknow",
              price: 590,
              is_favorite: false,
              color: ['green', 'blue', 'red'],
              quantity: 0,
              image: 'https://images.unsplash.com/photo-1601593346740-925612772716?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
          },
          {
              id: 4,
              title: "Air freshener",
              brand: "Febreze",
              price: 120,
              is_favorite: false,
              color: ['green', 'blue', 'red'],
              quantity: 0,
              image: 'https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
          },
          {
              id: 5,
              title: "Google Home",
              brand: "Google",
              price: 3290,
              is_favorite: false,
              color: ['green', 'blue', 'red'],
              quantity: 0,
              image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
          },
          {
              id: 6,
              title: "VR Gaming",
              brand: "Unknow",
              price: 22490,
              is_favorite: false,
              color: ['green', 'blue', 'red'],
              quantity: 0,
              image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=996&q=80'
          },
      ],
      cart: JSON.parse(localStorage.getItem('cart')),
      show_modal: false,
    },
    methods: {
      addToCart(product){
        if((this.cart.find(item => item.id === product.id))){

          this.cart = this.cart.map(item => {
            if(item.id === product.id) {
              item.quantity++
            }

            return item;
          })
          return;
        }
        this.cart.push({ ...product, quantity: 1});
      },
      removeFromCart(product, index){
        if((this.cart.find(item => item.id === product.id))){
          if(product.quantity == 1) return this.cart.splice(index, 1);

          this.cart = this.cart.map(item => {
            if(item.id === product.id && product.quantity != 1) {
              item.quantity--;
            }

            return item;
          })
          return;
        }
      },
      goCheckout(){
        localStorage.setItem('cart', JSON.stringify(this.cart))
        window.location.replace('./checkout.html')
      }
    },
    computed: {
      totalPrice(){
        return this.cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
      },
      cart(){
        this.cart = JSON.parse(localStorage.getItem('cart'));
      }
    },
    watch: {
      totalPrice(current,previous){
        console.log(current, previous)
      },
      // cart(){
      //   this.cart = JSON.parse(localStorage.getItem('cart'))
      // },
    }
})