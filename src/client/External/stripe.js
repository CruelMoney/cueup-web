const tag = document.createElement('script');
tag.src = 'https://js.stripe.com/v3/';
tag.id = 'stripe-js';
document.getElementsByTagName('head')[0].appendChild(tag);
