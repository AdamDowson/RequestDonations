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
    currencies: ['ETH', 'REQ', 'DAI', 'OMG', 'KNC']
  });
  requestDonations.start()
</script>
```

Change the 'address' field to the address where you want to recieve funds.

Change the 'currencies' field to allow / limit currencies which you want to recieve. Currently this is limited to ETH, REQ, DAI, OMG and KNC

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
