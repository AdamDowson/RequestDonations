# Request Donations

## Adding Request Donations to your site. 

Adding cryptocurrency donations has never been easier, in just a few steps you can start receiving donations in several cryptocurrencies powered by the Request network.

Firstly, simply copy and paste the following script and paste just before the closing &lt;body&gt; tag on your site. 

```markup
<script type="text/javascript" src="https://donations.request.network/donate.js"></script>
<script type="text/javascript">
  var requestDonations = new requestNetworkDonations({
    address: '0x2027c7fd9e48c028e7a927a6def44f4b2e52c703'
  });
  requestDonations.start();
</script>
```

The next step is to add your address, to do this change the 'address' parameter to the address where the donations should be sent. Please note

**Please note, if you are using a centralised service to store your wallet \(like Coinbase\) please ensure that they fully support the currencies you are accepting - your donations might get lost otherwise.** 

The final step is to add a way to trigger the donations modal, add an id of requestDonationTrigger to any item in the DOM, for example: 

```markup
<button id="requestDonationTrigger">Click here to trigger the modal</button>
```

You can view an example bare-bone implementation here: [https://donations.request.network/demo2/](https://donations.request.network/demo2/) \(currently running on Rinkeby\)

### SquareSpace Integration 

A huge thanks to Franco for creating the following SquareSpace integration guide:

[https://medium.com/@franco\_76154/how-to-start-accepting-crypto-donations-on-squarespace-for-n00bs-5d0125a67a1f](https://medium.com/@franco_76154/how-to-start-accepting-crypto-donations-on-squarespace-for-n00bs-5d0125a67a1f)

## Filtering Currencies

Currently, if you don't specify a 'currencies' parameter every accepted currency will show automatically, any new currencies that are supported will get automatically added. If you want to limit the currencies you want to accept simply add a 'currencies' parameter like so:

```markup
<script type="text/javascript" src="https://donations.request.network/donate.js"></script>
<script type="text/javascript">
  var requestDonations = new requestNetworkDonations({
    address: '0x2027c7fd9e48c028e7a927a6def44f4b2e52c703',
    currencies: ['ETH', 'REQ', 'DAI', 'OMG', 'KNC', 'DGX']
  });
  requestDonations.start();
</script>
```

 You can also filter the order of the currencies simply by rearranging the values, a full exhaustive list on accepted currencies are as follows:

* ETH \(Ether\)
* REQ \(Request\)
* Sai \(Single Collateral Dai stablecoin\)
* OMG \(OmiseGo\)
* KNC \(Kyber Network\)
* DGX \(Digix Gold Token\)
* KIN \(Kin\)
* BNB \(Binance Coin\)
* BAT \(Basic Attention Token\)
* ZRX \(0x\)
* LINK \(Chainlink\)

_Last updated: 2018/09/28_

## Limiting the maximum donation amount

For tax purposes you might want to limit donation amounts to a certain value, to do this pass in a max\_amount parameter like below.

```markup
<script type="text/javascript" src="https://donations.request.network/donate.js"></script>
<script type="text/javascript">
  var requestDonations = new requestNetworkDonations({
    address: '0x2027c7fd9e48c028e7a927a6def44f4b2e52c703',
    currencies: ['ETH', 'REQ', 'DAI', 'OMG', 'KNC', 'DGX'],
    max_amount: 200
  });
  requestDonations.start();
</script>
```

This is the current maximum donation amount in $ - multi-currency support will be available in the near future. 

## Testing \(Rinkeby\)

If you want to test on Rinkeby simply pass in a network parameter like so:

```javascript
var requestDonations = new requestNetworkDonations({
    address: '0xc2390220fc9b6d014d86d90d873c3edb8c1c4156',
    currencies: ['ETH', 'REQ', 'DAI', 'OMG', 'KNC', 'DGX'],
    network: 4
  });
```
