const model  = require('../../../models/index.model');
const config = require('../../../config/index');
const db 	   = config.connection;
const async = require("async");
const mongoose = require('mongoose');
const Contact     = model.contact;
const { validationResult } = require('express-validator');

module.exports = {
    // @route       GET api/v1/getStaticPageData
    // @description Get Static Page Data
    // @access      Public
    getStaticPageData : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let pageName = req.query.pageName;
            let data = {};
            if(pageName == 'ABOUTUS')
            {
                data.heading = 'About Us';
                data.data = `Copyright 2017 PiknDel.com. All Rights Reserved.\r\nAt PiknDel.com, we aim to provide customers with access to servicemen, to carry out the service specified below, in a timely and hassle-free manner. On booking services the following terms and conditions are accepted and agreed to by the customer:\r\n?\tInterpretation & General \r\n\"Client\" is the person, firm, company or organization for whom pikndel has agreed to provide the Services in accordance with these conditions; \"Contract\" is the Contract for the facilitation of Errand Services which shall be governed by these conditions; \"Services\" means the Errand Services to be provided by Pikndel to or for the Client; \"Charge\" means the Charge payable by the Client to Pikndel as notified by PIKNDEL from time to time.\r\n\r\nPikndel shall be entitled to alter and vary these conditions from time to time without any liability to the Client. It is the Client?s responsibility to check these pages periodically for any updates.\r\n\r\nPikndel?s working hours are 9am-7pm, Monday to Sunday. Where Pikndel is required to provide Services outside of these hours, Pikndel shall be entitled to make an extra Charge to the Client for this reason, and the same shall be notified to the Client ahead of time. Outside normal hours, the Client may reach Pikndel by telephone, voice, or e-mail. Pikndel will respond to all messages left by the Client as soon as possible.\r\n\r\nTelephone calls between Pikndel and the Client may be recorded and monitored from time to time.\r\n\r\n?\tSupply of the Services\r\nPikndel shall provide the Services to the Client subject to these Conditions or such other conditions as may be agreed between Pikndel and the Client.\r\n\r\nThe Service permits the Client to instruct Pikndel to facilitate errands for or on the behalf of the Client. This may involve the pick up and\/ or delivery of personal or other items or goods. Pikndel does not currently provide the broad spectrum of services as mainstream lifestyle management companies, and therefore reserves the right to decline to facilitate requests requiring non-specialist errand running skills. Pikndel may also decline to run an errand, which it deems immoral or unlawful.\r\n\r\nThe turnaround time for normal errands (errands requiring no waiting, within Pikndel area of coverage, not encumbered by other agreements e.g. specified ?time-bound? and ?urgent?) will be decided by Pikndel Team. However Pikndel intends to facilitate all errand requests within the same working day, if Pikndel has received such request by the errand reception-cut-off time. Requests received after reception-cut-off time may be facilitated the following working day.\r\n\r\nWhere Pikndel is unable to run any errands it will inform the Client as soon as is reasonably possible.\r\n\r\n?\tCharges\r\nSubject to any special terms agreed, the Client shall pay Pikndel the Charge and any additional sums agreed between Pikndel and the Client for the provision of the Services.\r\n\r\nPikndel shall be entitled to vary the Charge from time to time and shall communicate any such changes to the Client before any payment is made.\r\n\r\nPikndel shall be entitled to invoice the Client for any incidental costs incurred during the facilitation of the Client?s request, including costs from unexpected delays, toll charges etc.\r\n\r\nAll payments made to Pikndel via Credit Card transactions are liable to a handling charge. This handling charge is added to the total sum owed to Pikndel by the Client.\r\n\r\nAll quotations given and charges mentioned will be exclusive of Service Tax unless otherwise stated.\r\n\r\nThe Charge and any additional sum due shall be paid by the Client (without any set off, counterclaim or other deduction) in advance.\r\n\r\nA late payment penalty of the total invoiced charge will be payable to Pikndel if payments not received by Pikndel.\r\nThe applicable Charges will be based upon the characteristics of the courier\/parcel\/shipment actually tendered to us. If you dispute any Charges you must let Pikndel know within thirty (30) days after the date that Pikndel bills your payment instrument. We reserve the right to change Pikndel?s rates. If Pikndel does change any of its rates, Pikndel will post the new rates to the Service, effective as of the posting date. Your continued use of the Service after the price change becomes effective constitutes your agreement to pay the changed amount.\r\n\r\nShippers\/Consignors are responsible for providing accurate and complete shipment information to Pikndel, including service selected, number, weight, and dimensions of shipments. If any aspect of the shipment information is incomplete or incorrect as determined by Pikndel in its sole discretion, Pikndel may adjust Charges at any time.\r\n\r\nThe price quote displayed in the Service, either on the Site or in-app, for your particular courier\/parcel\/shipment requirement (hereinafter ?Quote?) is an estimate and not the exact price or the final price that you will be charged. The exact charges finally applicable to you will be based on the actual weight and dimensions of the courier once in the final packed state. \r\n\r\nThe Quote is for your reference to know the approximate cost you will incur. The Quotes are produced through Pikndel?s statistical analysis of shipment data of items similar to the item you are requesting to be shipped. The Quotes showed to you are inclusive of all taxes, charges, and fees applicable for the shipment.\r\n\r\n?\tClient?s Responsibilities\r\nServices provided by Pikndel are provided expressly for the Client or any person or group named by the Client to receive the Service.\r\n\r\nThe Client shall not request of Pikndel to run errands which are immoral or unlawful in nature.\r\n\r\nThe Client shall endeavor to provide Pikndel with as much detailed information as possible regarding their request in order for Pikndel to provide excellent service.\r\n\r\nThe Client shall not ask Pikndel to run errands to, from and for people or places where Pikndel staff or associates may experience any form of abuse, bodily harm or death.\r\n\r\nIf the Client should request that Pikndel use the Client?s credit card and \/or credit facilities for the purpose of rendering Services, the Client shall, promptly and upon request, provide written confirmation of such authorization (in such form as Pikndel shall request) for Pikndel to use any such credit facility. The Client acknowledges and agrees that Pikndel shall have no liability or be responsible in any way whatsoever in respect of the use of the Client?s credit card and \/or other credit card facilities provided that Pikndel acts in accordance with the instructions issued by the Client in relation thereto.\r\n\r\n?\tTermination and refunds\r\nWhen the Client has entered into an agreement with Pikndel by assigning an errand and making payment for same, requests for refunds may only be accommodated in the following circumstances:\r\n1.\twhere Pikndel has not already begun to process the request.\r\n2.\twhere the errand does not require same day facilitation, in which case a minimum 24hour notice period by the Client is applicable.\r\nPikndel will make refunds less direct costs to itself including any handling costs\r\n\r\nWithout prejudice to any other rights and remedies available, Pikndel shall have the right to terminate the Contract for the provision of all or any of the Services upon written notice if the Client commits a serious breach of these conditions.\r\n\r\nOn termination for any reason whatsoever, the Client shall immediately make payment to Pikndel of all and any sums outstanding and owing to Pikndel under these conditions (including the Charge or any outstanding balance)\r\n?\tLiability\r\nPikndel shall not be liable for any loss, cost, expense or damage of any nature whatsoever exceeding Rs.5000 (whether direct or indirect) resulting from the use of Pikndel Services. In case of special request you can call us at 011 - 25747474 for Insurance of your parcel.\r\n\r\nPikndel warrants to the Client that Pikndel shall use all of its reasonable endeavors to provide the Services using reasonable care and skill and, as far as reasonably possible, in accordance with the Clients requests and instructions.\r\n\r\nPikndel shall have no liability to the Client for any loss, damage, costs, expenses or other claims for compensation arising from requests or instructions supplied by the Client which are incomplete, incorrect or inaccurate or arising from their late arrival or non-arrival, or any other fault of the Client.\r\n\r\nPikndel shall not be liable or be deemed to be in breach of the Contract by reason of any delay in performing, or any failure, any of Pikndel?s obligations in relation to the Services, if the delay or failure was due to any cause beyond Pikndel?s reasonable control.\r\n\r\nSubject to the provisions of these Conditions of Service, the maximum liability of Pikndel to the Client for breach of any of its obligations hereunder shall be limited to the value of the Charge (provided that the Charge has at such time been paid by the Client in full).\r\n\r\n?\tGeneral\r\nThese conditions (together with any other terms and conditions agreed in writing between Pikndel and the Client from time to time) constitute the entire agreement between the parties, and supercede any previous agreement or understanding and may not be varied except on notice from Pikndel. All other terms and conditions express or implied by a statute or otherwise are excluded to the fullest extents permitted by Law.\r\n\r\nAny notice required or permitted to be given by either party to the other under these conditions shall be in writing addressed to the other party at it?s registered office or principal place of business or residential address (as the case may be) or such other address as may at the relevant time have been notified pursuant to the provision to the party giving notice. Any notice may be sent by first class post, facsimile transmission or email and notice shall be deemed to have been served on the expiry of 48 hours in the case of post or at the time of transmission in the case of facsimile or email transmission.\r\n\r\nNo failure or delay by Pikndel in exercising any of its rights under the Contract shall be deemed to be a waiver of that right, and no waiver by Pikndel of any breach of the Contract by the Client shall be considered as a waiver of any subsequent breach of the same or any other provision.\r\n\r\nIf any provision of these conditions is held by any competent authority to be invalid or unenforceable in whole or in parts, the validity of the other provisions of these conditions will still stand.\r\n\r\nThese conditions and the Contract to which they relate shall be governed and construed in accordance with the Indian Law.\r\n`;
            }else if(pageName == 'PRIVACYPOLICY'){
                data.heading = 'Privacy Policy';
                data.data = 'Privacy Policy page data goes here';
            }
            else if(pageName == 'TC'){
                data.heading = 'Terms & Condition';
                data.data = 'Terms & Condition page data goes here';
            }else{
                data.heading = 'No Heading Found';
                data.data = 'No Data Found';
            }
            return res.status(200).json({ 
                                        data: data, 
                                        status: 'success', 
                                        message: "Data fetched successfully!!" 
                                    });
        }
        catch (e){
            console.log(e)
            return res.status(500).json({ 
                                    data: [],  
                                    status: 'error', 
                                    errors: [{
                                        msg: "Internal server error"
                                    }]
                                });
        }
    },
    // @route       GET api/v1/contactUs
    // @description Request for Contact
    // @access      Public
    contactUs : async function(req,res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try{
            let contactInsertData = {
				name : req.body.name,
				email : req.body.email,
				mobile : req.body.mobile,
				message : req.body.message,
			};
			let contact = new Contact(contactInsertData);
			contact.save(function(err, data){
				return res.status(200).json({ 
                    data: contact, 
                    status: 'success', 
                    message: "Contact Request send successfully!!" 
                });	
			})
        }
        catch (e){
            console.log(e)
            return res.status(500).json({ 
                                    data: [],  
                                    status: 'error', 
                                    errors: [{
                                        msg: "Internal server error"
                                    }]
                                });
        }
    }
}