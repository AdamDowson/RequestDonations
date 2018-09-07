donations.request.network - donations script and demos
==================================

Demo
---------------
[MakerDAO Demo](https://donations.request.network/demo/)

[Basic Demo](https://donations.request.network/demo2/)

How to use
---------------

Embed the following just before the body tags on your site
```sh
<script type="text/javascript" src="https://donations.request.network/donate.js"></script>
<script type="text/javascript">
  var requestDonations = new requestNetworkDonations({
    address: '0xc2390220fc9b6d014d86d90d873c3edb8c1c4156',
    currencies: ['ETH', 'REQ', 'DAI', 'OMG', 'KNC', 'DGX'],
    network: 4
  });
  requestDonations.start();
</script>
```

Change the 'address' field to the address where you want to recieve funds.

(optional) Change the 'currencies' field to limit the currencies which you want to recieve. Currently the accepted currencies are: ETH, REQ, DAI, OMG, DGX and KNC. If this parameter is not set all available currencies will be shown - any new currencies will show automatically.

(optional) Set the network parameter value to 4 for testing on Rinkeby. Leave blank for mainnet

Add an ID of 'requestDonationTrigger' to an element in your HTML e.g. ```<button id="requestDonationTrigger">Click here to trigger the modal</button>```

Getting Started
---------------

```sh
# Install dependencies
npm install

# Start development live-reload server
npm run dev

# Start production server:
npm start
```
