const SmartTokens = artifacts.require("SmartTokens");
//const MetaCoin = artifacts.require("MetaCoin");

module.exports = function(deployer) {
   deployer.deploy(SmartTokens);
 // deployer.link(ConvertLib, MetaCoin);
 // deployer.deploy(MetaCoin);
};

