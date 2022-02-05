# 💳 Tokenise subscriptions to web services
- Pay subscriptions to web services in crypto (i.e. Netflix)
- Obtain a unique and evolving nft as proof of subscription to the service
- Give, trade or sell your subscription to someone else on a secondary market
- Possibility to extend your subscription and upgrade your nft
- Standardise the subscription process to make it generic to all platforms and services - people just need a custodial wallet and cryptocurrency

# 📽️ Miniflix Dapp
Simple Dapp similar to Netflix where you can connect any custodial wallet and subscribe to the web service using ETH. The user selects the duration of the subscription (1, 3 or 12 months) and the tier (basic, standard or premium), and after paying, he gets in return a Subscription Card NFT. The website then identifies the NFT in the user's wallet and allows the user to access the content for which they paid.

## Tier system
- Basic: SD quality (480p) / **$10**
- Standard: Full HD quality (1080p) + 2 devices can watch simultaneously / **$15**
- Premium: Ultra HD quality (4k) and HDR + 4 devices can watch simultaneously / **$20**

## Subscription Card NFT
```yaml
// simple example
name: Miniflix Subscription Card #120
collection: Miniflix Subscription Cards (MSC)
parameters:
  - startDate: 05/02/2022
  - duration: 1 month
  - tier: basic
```
