# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.1](https://github.com/ecomplus/application-starter/compare/v1.0.0...v1.0.1) (2020-10-20)


### Bug Fixes

* **auth-scope:** request auth to PATCH orders and products ([b0bee9b](https://github.com/ecomplus/application-starter/commit/b0bee9b3b35f7664c5f63d217fcd46b7c7444dac))
* **export-product:** pass only 'short_description' to tiny product ([dbe8798](https://github.com/ecomplus/application-starter/commit/dbe879833317b836ca32e3a452e1c616fa01913d))
* **import-order:** catch invoice read request errror ([64b9024](https://github.com/ecomplus/application-starter/commit/64b90241cb65c3eae6e2d9a089eeea3bbae7f87e))
* **import-order:** must set partial order 'shipping_lines' when object changes ([9583040](https://github.com/ecomplus/application-starter/commit/958304032c71d0e4c9a07724cd1f6428c7a88f98))
* **import-order:** passing tiny instance to order parser (read invoice) ([b6d7521](https://github.com/ecomplus/application-starter/commit/b6d75214126ec1aeef4c07977b037b58394be9f5))
* **import-order:** skip getting invoice if id not gt 0 ([3308bba](https://github.com/ecomplus/application-starter/commit/3308bbaa74c3a73097c19f090dd1d1b632fb3f83))
* **import-orders:** fix integration handler return ([825e82e](https://github.com/ecomplus/application-starter/commit/825e82e6111f8822914ea83905905b67a32846c2))
* **import-product:** check hidden queue to skip new product import ([44b71fa](https://github.com/ecomplus/application-starter/commit/44b71fa9928ea737cb9dbd1aa1702ab5ac7e51eb))
* **import-product:** fix parsing tiny product variations ([5aafcce](https://github.com/ecomplus/application-starter/commit/5aafcce6f959f4837b59d50c340ce616db964785))
* **import-product:** fix setting variation price (parse float) ([105ac12](https://github.com/ecomplus/application-starter/commit/105ac12f22ba15f79a937dd019f2266a51be2c52))
* **import-product:** prevent erro with SKU not found ([ad52175](https://github.com/ecomplus/application-starter/commit/ad521750166905ee87a881a9210f4381415803b1))
* **import-product:** validate gtin from tiny product source ([de432fe](https://github.com/ecomplus/application-starter/commit/de432fee1d891329539aa0487ac2239d482ab7fb))
* **import-products:** continue with !payload.product (new product) ([177fe73](https://github.com/ecomplus/application-starter/commit/177fe738a2b09268841af16d62b0cabfe86fdd2c))
* **import-products:** select up to 10 stock update docs to delete old ones ([7db8703](https://github.com/ecomplus/application-starter/commit/7db87037ca11a0397e068f3c3ae2a37dfc65f990))

## 1.0.0 (2020-10-20)


### Features

* **auth-callback:** add application "self" data trigger ([814df87](https://github.com/ecomplus/application-starter/commit/814df87b23dd791e5884e220664025a07fc0afc8))
* **ecom-config:** set app title, auth scope, admin settings and procedures ([91ddc6a](https://github.com/ecomplus/application-starter/commit/91ddc6ac79e5be1e96e6e9a29223ddf8226d4f0b))
* **export-order:** parsing ecom financial/fulfillment status to tiny ([8647880](https://github.com/ecomplus/application-starter/commit/864788029e9ed7a5f27608970e3a09d7ab78b98a))
* **export-orders:** handling order status update ([de014a4](https://github.com/ecomplus/application-starter/commit/de014a46ecd15604e41e29a1860b00f196ed4059))
* **export-orders:** parsing and exporting new orders to tiny ([0d3e41c](https://github.com/ecomplus/application-starter/commit/0d3e41cceec6908a45eb0532a099b8202103d846))
* **export-product:** handling product parse and export to tiny ([5bddae7](https://github.com/ecomplus/application-starter/commit/5bddae7bd06694acc815ebfc357ac7613306da7a))
* **import-order:** handling import for order status, tracking and invoices ([0cd56b1](https://github.com/ecomplus/application-starter/commit/0cd56b1687463290e2f8cd07c134fc56434a93eb))
* **import-product:** handling product importation or stock quantity updates ([39ca05c](https://github.com/ecomplus/application-starter/commit/39ca05cca0debfd62057efa7294f99276fa27087))
* **sync-from-tiny:** active sync one product when stock queue is empty ([4f9b13f](https://github.com/ecomplus/application-starter/commit/4f9b13f1132972308be67217f37162773a9f8057))
* **sync-from-tiny:** scheduled function to update status reading tiny queue ([2720abe](https://github.com/ecomplus/application-starter/commit/2720abe37591172d6dc106701873f0afcaac1115))
* **tiny-client:** abstracting response data handling ([0945b2b](https://github.com/ecomplus/application-starter/commit/0945b2b05c415ac50e591afb0a40dde34a6cbd82))
* **tiny-client:** constructor with axios request abstraction ([176a54f](https://github.com/ecomplus/application-starter/commit/176a54f8d43c9b2ea197af7a3b25185f50b81bcc))
* **update-app-data:** lib abstraction to update app data on store api ([6501c76](https://github.com/ecomplus/application-starter/commit/6501c768609bb4556d71a1f976570b28530862f4))
* **webhook:** setup webhook endpoint and integration handlers ([e72af52](https://github.com/ecomplus/application-starter/commit/e72af52c47ffe9eea83a17188f1cc355ba21b555))


### Bug Fixes

* **deps:** add @google-cloud/firestore to direct deps ([4eedd81](https://github.com/ecomplus/application-starter/commit/4eedd81af864faa0586c3a1a0ac51ead8f8c3658))
* **deps:** add form-data to direct pkg dependencies ([51ed98f](https://github.com/ecomplus/application-starter/commit/51ed98f74873d5d90272d621ae9ba4d303406fb2))
* **deps:** dedupe ([541f0ce](https://github.com/ecomplus/application-starter/commit/541f0ce56bb76be72d3b61b832c305ad8af56b3a))
* **deps:** remove qs, add xml-js ([efbc084](https://github.com/ecomplus/application-starter/commit/efbc084d4ffa310df5733eaa723855df481c8bbc))
* **ecom-config:** fix admin settings queues and procedure triggers for erp flux ([0f9aca0](https://github.com/ecomplus/application-starter/commit/0f9aca09ed38d345aa6ee9897b5bd4bb62ea178c))
* **export:** fix setting up tiny request params ([4c82ed2](https://github.com/ecomplus/application-starter/commit/4c82ed2e0ce2b18f1f94506a7d046ec3e2a3d573))
* **export-order:** fix passing app data to order parser ([cbac364](https://github.com/ecomplus/application-starter/commit/cbac364685f7499c93c88b694bc038ec8fd5f659))
* **export-order:** fix rechecking order number match on tiny api response ([e8cf595](https://github.com/ecomplus/application-starter/commit/e8cf595ad4d922ed47b65ed3fb5c4708494ee2ef))
* **export-order:** fix setting order id to update status ([6c7df14](https://github.com/ecomplus/application-starter/commit/6c7df1434de34013f7039cb9fd6ed2a9fb6452f3))
* **export-order:** get order with authentication ([fee4cdd](https://github.com/ecomplus/application-starter/commit/fee4cdd602e1b944b8eabfdf9879af4abb9f65d6))
* **export-order:** setting tiny order status ([5809ada](https://github.com/ecomplus/application-starter/commit/5809ada393ea1817f859a3760b7f47b869b093c1))
* **export-product:** fix checking if product is already registered by sku (codigo) ([40d08cc](https://github.com/ecomplus/application-starter/commit/40d08ccbb901691a586960f57b40d6e4969a97d6))
* **exports:** fix handling empty search request to tiny api ([7e1640e](https://github.com/ecomplus/application-starter/commit/7e1640ed128b596b15c547eac41cd3dd1bbac54c))
* **exports:** fix handling search results from tiny api ([3286374](https://github.com/ecomplus/application-starter/commit/32863747a9221eaa351bf8ed60c72f016ec4ad0e))
* **import-product:** fix handling tiny api search result ([240ac98](https://github.com/ecomplus/application-starter/commit/240ac9803b3b09dc7174d0d92fbe460b5e2dc530))
* **import-product:** properly set product._id ([5abf9c0](https://github.com/ecomplus/application-starter/commit/5abf9c0c9a65d9724b65146864ccb3452f580bf3))
* **import-products:** delete tiny stock updates tmp docs ([3b7855f](https://github.com/ecomplus/application-starter/commit/3b7855f14e4cae4dc81c54899384470a907737c3))
* **import-products:** fix handling import variations ([9ee78a3](https://github.com/ecomplus/application-starter/commit/9ee78a317e5239fc49c1145e50113e9f8b976b18))
* **import-products:** fix handling import variations ([06907ba](https://github.com/ecomplus/application-starter/commit/06907bacff4e5a63d7e3fa7369674e60656f0fc6))
* **import-products:** fix handling import variations ([7a07da4](https://github.com/ecomplus/application-starter/commit/7a07da4c9dcdd157f0f69653ef1171726a5e9e9b))
* **parse-order:** prevent substring from number or undefined ([70093cb](https://github.com/ecomplus/application-starter/commit/70093cbbefad53bf02edde2a769871bac2bd1a0a))
* **parse-order:** stop using locale to parse date ([952ab67](https://github.com/ecomplus/application-starter/commit/952ab677696ab352fbd6561228861eb13549dc39))
* **product-parse:** fix parsing ecomplus <-> tiny description ([cd6b5cd](https://github.com/ecomplus/application-starter/commit/cd6b5cd3235054fec5f986f3518d1b2d0120244f))
* **sync-from-tiny:** fix handling search results from tiny api ([269bce4](https://github.com/ecomplus/application-starter/commit/269bce44b9058ab91f67df87d0c2766421c03ab7))
* **sync-from-tiny:** fix mocking tiny stock list after active sync ([fbcfa77](https://github.com/ecomplus/application-starter/commit/fbcfa7713599ad6f792b618e82e60563f8f9c9bf))
* **sync-from-tiny:** prevent destructing undefined on promise handler ([3dc01d6](https://github.com/ecomplus/application-starter/commit/3dc01d65d88aa6ff5e4955ddf940f7855eb50d26))
* **tiny-client:** fix mocking axios error after tiny error response ([5ab6321](https://github.com/ecomplus/application-starter/commit/5ab6321ca37eb668843971918eed946c17dd90b7))
* **tiny-client:** parse some error codes to http status code ([82d451b](https://github.com/ecomplus/application-starter/commit/82d451b17a050b7806bf061943d20ab0faf63cb1))
* **tiny-client:** parse tiny error code to integer ([d8b4d03](https://github.com/ecomplus/application-starter/commit/d8b4d03bbe2928b158da1f9abe373ac8dd33ed57))
* **tiny-client:** parsing data fields to xml ([661f221](https://github.com/ecomplus/application-starter/commit/661f22117f107d23fd3c4acc7527ff694b8fdb50))

## [1.0.0-starter.15](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.14...v1.0.0-starter.15) (2020-07-26)


### Bug Fixes

* **deps:** bump @ecomplus/application-sdk@firestore ([fe4fe46](https://github.com/ecomplus/application-starter/commit/fe4fe46c2c4e1dfd21790f8c03a84245cb8fc8f3))
* **deps:** update all non-major dependencies ([#36](https://github.com/ecomplus/application-starter/issues/36)) ([b14f2e9](https://github.com/ecomplus/application-starter/commit/b14f2e9cb56d5b18500b678b074dbdbe099b041a))
* **deps:** update dependency firebase-admin to v9 ([#37](https://github.com/ecomplus/application-starter/issues/37)) ([204df95](https://github.com/ecomplus/application-starter/commit/204df95c37d24c455951081f9186178222097778))

## [1.0.0-starter.14](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.13...v1.0.0-starter.14) (2020-06-30)


### Bug Fixes

* **auth-callback:** check `row.setted_up` in place of 'settep_up' ([e2a73ca](https://github.com/ecomplus/application-starter/commit/e2a73ca029868d9c899d4a1c0d982f1c1ed5829f))
* **deps:** update all non-major dependencies ([#31](https://github.com/ecomplus/application-starter/issues/31)) ([702bee9](https://github.com/ecomplus/application-starter/commit/702bee9a31370579dd7718b5722180e5bb8996e8))
* **deps:** update dependency firebase-functions to ^3.7.0 ([#30](https://github.com/ecomplus/application-starter/issues/30)) ([0f459a3](https://github.com/ecomplus/application-starter/commit/0f459a3ab9fe21f8dc9e9bdfce33c0b6d43e3622))
* **deps:** update dependency firebase-tools to ^8.4.2 ([#29](https://github.com/ecomplus/application-starter/issues/29)) ([cf7e61e](https://github.com/ecomplus/application-starter/commit/cf7e61ef50aa976f33725d855ba19d06a7522fd4))
* **pkg:** update deps, start using node 10 ([172ed7f](https://github.com/ecomplus/application-starter/commit/172ed7f223cd23b9874c5d6209928b7d620b0cf6))

## [1.0.0-starter.13](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.12...v1.0.0-starter.13) (2020-06-03)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.13.0 ([b424410](https://github.com/ecomplus/application-starter/commit/b42441089e7020774c9586ed176e691ef4c755be))
* **refresh-tokens:** force appSdk update tokens task ([139a350](https://github.com/ecomplus/application-starter/commit/139a350c230fa36c37ab83e2debfe979d831cb08))

## [1.0.0-starter.12](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.11...v1.0.0-starter.12) (2020-05-29)


### Bug Fixes

* **deps:** replace @ecomplus/application-sdk to firestore version ([3d2ee85](https://github.com/ecomplus/application-starter/commit/3d2ee85feb2edab77950e5c266514152fbc9674d))
* **deps:** update all non-major dependencies ([#21](https://github.com/ecomplus/application-starter/issues/21)) ([7a370da](https://github.com/ecomplus/application-starter/commit/7a370da11dfd098c0a90da05d39fc62f9264fd63))
* **deps:** update all non-major dependencies ([#26](https://github.com/ecomplus/application-starter/issues/26)) ([e37e0e8](https://github.com/ecomplus/application-starter/commit/e37e0e8151768d79e81f4184ab937ddf9d775a4f))
* **deps:** update dependency uglify-js to ^3.9.2 ([#20](https://github.com/ecomplus/application-starter/issues/20)) ([adccf0a](https://github.com/ecomplus/application-starter/commit/adccf0a2fed37f2ccce57ded20d25af85407ac8a))

## [1.0.0-starter.11](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.10...v1.0.0-starter.11) (2020-04-27)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.13 ([70584c2](https://github.com/ecomplus/application-starter/commit/70584c245e97a1b539a3df3f74109f20d9a1fa3c))
* **setup:** ensure enable token updates by default ([67aea0e](https://github.com/ecomplus/application-starter/commit/67aea0eb363be3cc535a0f0f4d1b5b682958f243))

## [1.0.0-starter.10](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.9...v1.0.0-starter.10) (2020-04-27)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.11 ([b8217d0](https://github.com/ecomplus/application-starter/commit/b8217d03fe92b5c233615a0b6b4c01d7bad676c2))
* **deps:** update all non-major dependencies ([#19](https://github.com/ecomplus/application-starter/issues/19)) ([a99797a](https://github.com/ecomplus/application-starter/commit/a99797a129d6e2383ef5ef69c06afacd13cccfb0))
* **setup:** do not disable updates on refresh-tokens route ([b983a45](https://github.com/ecomplus/application-starter/commit/b983a45ada5575ee6435f7b3016ef35c28355762))

## [1.0.0-starter.9](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.8...v1.0.0-starter.9) (2020-04-21)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.10 ([8da579c](https://github.com/ecomplus/application-starter/commit/8da579c19c6530e8cc9fd338a07aece1fccc64ff))

## [1.0.0-starter.8](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.7...v1.0.0-starter.8) (2020-04-18)


### Bug Fixes

* **deps:** update all non-major dependencies ([#17](https://github.com/ecomplus/application-starter/issues/17)) ([785064e](https://github.com/ecomplus/application-starter/commit/785064ef5bf06db7c084f9b17b37a6077645735b))

## [1.0.0-starter.7](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.6...v1.0.0-starter.7) (2020-04-07)

## [1.0.0-starter.6](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.5...v1.0.0-starter.6) (2020-04-06)


### Bug Fixes

* **deps:** update all non-major dependencies ([#10](https://github.com/ecomplus/application-starter/issues/10)) ([b3c65e5](https://github.com/ecomplus/application-starter/commit/b3c65e5c7eb89a4825eb47c852ce65293d172314))
* **deps:** update all non-major dependencies ([#13](https://github.com/ecomplus/application-starter/issues/13)) ([33ff19b](https://github.com/ecomplus/application-starter/commit/33ff19bbdad1f34b6d1c255089dc0a0e4092b955))
* **deps:** update all non-major dependencies ([#8](https://github.com/ecomplus/application-starter/issues/8)) ([feba5b9](https://github.com/ecomplus/application-starter/commit/feba5b9cdc54e8304beff2b12658a6343ef37569))
* **deps:** update dependency firebase-functions to ^3.6.0 ([#15](https://github.com/ecomplus/application-starter/issues/15)) ([5f7f0a2](https://github.com/ecomplus/application-starter/commit/5f7f0a2bf5c744000996e2a0b78690b363462ee7))
* **deps:** update dependency firebase-tools to ^7.16.1 ([#14](https://github.com/ecomplus/application-starter/issues/14)) ([b8e4798](https://github.com/ecomplus/application-starter/commit/b8e479851bd02bf5929a7df8a71a761f1c1c1654))
* **deps:** update dependency firebase-tools to v8 ([#16](https://github.com/ecomplus/application-starter/issues/16)) ([b72560e](https://github.com/ecomplus/application-starter/commit/b72560e4fc86496499d553e47094ace25436272b))
* **ecom-modules:** fix parsing mod names to filenames and vice versa ([99c185a](https://github.com/ecomplus/application-starter/commit/99c185afebeae77deb61537ed9de1c77132c16ce))

## [1.0.0-starter.5](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.4...v1.0.0-starter.5) (2020-03-05)


### Features

* **market-publication:** handle full featured app publication to Market ([28379dc](https://github.com/ecomplus/application-starter/commit/28379dc3c4784e757c8f25e5d737f6143682b0db))
* **static:** handle static with server app files from public folder ([827d000](https://github.com/ecomplus/application-starter/commit/827d00079b0dc169b2eef31b8e0ac73c596307a8))

## [1.0.0-starter.4](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.3...v1.0.0-starter.4) (2020-02-21)


### Features

* **calculate-shipping:** basic setup for calculate shipping module ([db77595](https://github.com/ecomplus/application-starter/commit/db7759514bb25d151dd4508fb96b84c52b3e94ba))


### Bug Fixes

* **home:** fix replace accets regex exps to generate slug from title ([198cc0b](https://github.com/ecomplus/application-starter/commit/198cc0b911d4874d96f3cd5254d30cab5fe89765))
* **home:** gen slug from pkg name or app title if not set or default ([25c20bf](https://github.com/ecomplus/application-starter/commit/25c20bfade65a86e4f4b1026ef59a5694a022a74))

## [1.0.0-starter.3](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.2...v1.0.0-starter.3) (2020-02-21)

## [1.0.0-starter.2](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.1...v1.0.0-starter.2) (2020-02-21)


### Bug Fixes

* **config:** stop reading app from functions config ([7b9aab7](https://github.com/ecomplus/application-starter/commit/7b9aab727fefe8a5b84695e90a0d68e02b8c3f62))

## [1.0.0-starter.1](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.0...v1.0.0-starter.1) (2020-02-20)


### Features

* **get-auth:** endpoint to return auth id and token for external usage ([40a8ae2](https://github.com/ecomplus/application-starter/commit/40a8ae2e895d6e32c7032ca500040ec82c80dc5d))
* **server:** also supporting passing Store Id from query ([111f3a7](https://github.com/ecomplus/application-starter/commit/111f3a716fbfd2e155e3fb24242bddcae7cb065c))


### Bug Fixes

* **server:** remove 'routes' path when setting filename for routes ([119524c](https://github.com/ecomplus/application-starter/commit/119524c523a11364ed912769637a6f8e479af5f1))

## [1.0.0-starter.0](https://github.com/ecomplus/application-starter/compare/v0.1.1...v1.0.0-starter.0) (2020-02-18)


### Features

* **router:** recursive read routes dir to auto setup server routes ([ff2b456](https://github.com/ecomplus/application-starter/commit/ff2b45604723a8146c9481ea36a9400da5ccc2bc))


### Bug Fixes

* **home:** fix semver on for app.version (remove version tag if any) ([ad36461](https://github.com/ecomplus/application-starter/commit/ad364614a7f5599850ad39e00a94d310742e8f80))
* **middlewares:** update route files exports (named exports by methods) ([6a22e67](https://github.com/ecomplus/application-starter/commit/6a22e67135bc6110e6da6b4ab25f67ad8d77f597))

### [0.1.1](https://github.com/ecomplus/application-starter/compare/v0.1.0...v0.1.1) (2020-02-18)


### Features

* **env:** get 'pkg' from functions config ([bf45ec3](https://github.com/ecomplus/application-starter/commit/bf45ec33a2147d5be91fdc4955bd6cfa1b0867e2))
* **home:** set version and slug from root package, fix with uris ([d4b61fa](https://github.com/ecomplus/application-starter/commit/d4b61fab427aefdb2ac485d90eb1abe15d6aafc6))


### Bug Fixes

* **env:** firebase doesnt uppercase config ([502185e](https://github.com/ecomplus/application-starter/commit/502185ed30f346d8db77b849d6ba0eb48cb777cb))
* **require:** update @ecomplus/application-sdk dependency name ([d4174ac](https://github.com/ecomplus/application-starter/commit/d4174ac5425b85590db0e92d4b1d69a8567a6c55))

## [0.1.0](https://github.com/ecomplus/application-starter/compare/v0.0.4...v0.1.0) (2020-02-17)

### [0.0.4](https://github.com/ecomclub/firebase-app-boilerplate/compare/v0.0.3...v0.0.4) (2020-02-16)


### Bug Fixes

* **server:** update routes names (refresh-tokens) ([79a2910](https://github.com/ecomclub/firebase-app-boilerplate/commit/79a2910817cf4193b40e02b2b1e6b920e7fefb2d))

### [0.0.3](https://github.com/ecomclub/express-app-boilerplate/compare/v0.0.2...v0.0.3) (2020-02-15)


### Features

* **server:** start reading env options, handle operator token ([ce107b7](https://github.com/ecomclub/express-app-boilerplate/commit/ce107b74cde375e875a85cc3ba0cc6a73740785d))
* **update-tokens:** adding route to start update tokens service (no content) ([20c62ec](https://github.com/ecomclub/express-app-boilerplate/commit/20c62ec6800fc326b89e8cf54b2916f56e5910e4))


### Bug Fixes

* **auth-callback:** fix handling docRef (desn't need to get by id again) ([629ca5a](https://github.com/ecomclub/express-app-boilerplate/commit/629ca5ab9849e3822cc190f423da5bf2e0c4daab))
* **auth-callback:** save procedures if not new, check and set 'settep_up' ([#3](https://github.com/ecomclub/express-app-boilerplate/issues/3)) ([4a01f86](https://github.com/ecomclub/express-app-boilerplate/commit/4a01f86c37e09cd7c0363f6fbc80de6eeef3ba20))
* **ECOM_AUTH_UPDATE_INTERVAL:** disable set interval (no daemons on cloud functions) ([2aa2442](https://github.com/ecomclub/express-app-boilerplate/commit/2aa2442061f0308be9eb9430552fa04ad148788c))
* **env:** fixed to get appInfor variable ([e9b1a3c](https://github.com/ecomclub/express-app-boilerplate/commit/e9b1a3ce0d17ee74a5eada70589340fd5a70e786))
* **env:** fixed to get appInfor variable ([22687e2](https://github.com/ecomclub/express-app-boilerplate/commit/22687e25f611d49f8c01494af114e0289cec251e))
* **middleware:** check standard http headers for client ip ([5045113](https://github.com/ecomclub/express-app-boilerplate/commit/504511329afe9277d540f0f542a316d04634ce9e))

### 0.0.2 (2020-02-11)


### Bug Fixes

* **lib:** remove unecessary/incorrect requires with new deps ([69f2b77](https://github.com/ecomclub/express-app-boilerplate/commit/69f2b77))
* **routes:** fix handling appSdk (param) ([0cf2dde](https://github.com/ecomclub/express-app-boilerplate/commit/0cf2dde))
* **setup:** added initializeApp() to firebase admin ([e941e59](https://github.com/ecomclub/express-app-boilerplate/commit/e941e59))
* **setup:** manually setup ecomplus-app-sdk with firestore ([64e49f8](https://github.com/ecomclub/express-app-boilerplate/commit/64e49f8))
* **setup:** manually setup ecomplus-app-sdk with firestore ([c718bd0](https://github.com/ecomclub/express-app-boilerplate/commit/c718bd0))
* **setup:** manually setup ecomplus-app-sdk with firestore ([33909bf](https://github.com/ecomclub/express-app-boilerplate/commit/33909bf)), closes [/github.com/ecomclub/ecomplus-app-sdk/blob/master/main.js#L45](https://github.com/ecomclub//github.com/ecomclub/ecomplus-app-sdk/blob/master/main.js/issues/L45)
* **startup:** setup routes after appSdk ready, add home route ([d182555](https://github.com/ecomclub/express-app-boilerplate/commit/d182555))


### Features

* **firestore-app-boilerplate:** Initial commit ([c9963f0](https://github.com/ecomclub/express-app-boilerplate/commit/c9963f0))
* **firestore-app-boilerplate:** Initial commit ([be493ea](https://github.com/ecomclub/express-app-boilerplate/commit/be493ea))
* **firestore-support:** minor changes ([3718cba](https://github.com/ecomclub/express-app-boilerplate/commit/3718cba))
* **firestore-support:** refactoring to  use saveProcedures function ([62971ef](https://github.com/ecomclub/express-app-boilerplate/commit/62971ef))
* **firestore-support:** removed sqlite error clausule ([2d47996](https://github.com/ecomclub/express-app-boilerplate/commit/2d47996))
* **routes:** add home route (app json) ([42a3f2b](https://github.com/ecomclub/express-app-boilerplate/commit/42a3f2b))

# [LEGACY] Express App Boilerplate

### [0.1.1](https://github.com/ecomclub/express-app-boilerplate/compare/v0.1.0...v0.1.1) (2019-07-31)


### Bug Fixes

* **procedures:** fix checking for procedures array to run configureSetup ([1371cdc](https://github.com/ecomclub/express-app-boilerplate/commit/1371cdc))

## [0.1.0](https://github.com/ecomclub/express-app-boilerplate/compare/v0.0.2...v0.1.0) (2019-07-31)

### 0.0.2 (2019-07-31)


### Bug Fixes

* chain promise catch on lib getConfig ([281abf9](https://github.com/ecomclub/express-app-boilerplate/commit/281abf9))
* fix mergin hidden data to config ([8b64d58](https://github.com/ecomclub/express-app-boilerplate/commit/8b64d58))
* fix path to require 'get-config' from lib ([11425b0](https://github.com/ecomclub/express-app-boilerplate/commit/11425b0))
* get storeId from header and set on req object ([a3bebaa](https://github.com/ecomclub/express-app-boilerplate/commit/a3bebaa))
* handle error on get config instead of directly debug ([f182589](https://github.com/ecomclub/express-app-boilerplate/commit/f182589))
* routes common fixes ([2758a57](https://github.com/ecomclub/express-app-boilerplate/commit/2758a57))
* using req.url (from http module) instead of req.baseUrl ([d9057ca](https://github.com/ecomclub/express-app-boilerplate/commit/d9057ca))


### Features

* authentication callback ([8f18892](https://github.com/ecomclub/express-app-boilerplate/commit/8f18892))
* conventional store api error handling ([bcde87e](https://github.com/ecomclub/express-app-boilerplate/commit/bcde87e))
* function to get app config from data and hidden data ([ba470f5](https://github.com/ecomclub/express-app-boilerplate/commit/ba470f5))
* getting store id from web.js ([72f18c6](https://github.com/ecomclub/express-app-boilerplate/commit/72f18c6))
* handling E-Com Plus webhooks ([63ba19f](https://github.com/ecomclub/express-app-boilerplate/commit/63ba19f))
* main js file including bin web and local ([6b8a71a](https://github.com/ecomclub/express-app-boilerplate/commit/6b8a71a))
* pre-validate body for ecom modules endpoints ([f06bdb0](https://github.com/ecomclub/express-app-boilerplate/commit/f06bdb0))
* setup app package dependencies and main.js ([b2826ed](https://github.com/ecomclub/express-app-boilerplate/commit/b2826ed))
* setup base app.json ([015599a](https://github.com/ecomclub/express-app-boilerplate/commit/015599a))
* setup daemon processes, configure store setup ([db3ca8c](https://github.com/ecomclub/express-app-boilerplate/commit/db3ca8c))
* setup procedures object ([c5e8627](https://github.com/ecomclub/express-app-boilerplate/commit/c5e8627))
* setup web app with express ([d128430](https://github.com/ecomclub/express-app-boilerplate/commit/d128430))
