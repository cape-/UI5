function serializeObjectToXML(oData, sRootNodeTag = "parameters", sChildNodeTag = "field", sChildNodeNameTag = "name", sChildNodeValueTag = "value") {
    function _createFieldNode(oDoc, sName, xValue) {
        const oNodeField = oDoc.createElement(sChildNodeTag);
        const oNodeName = oDoc.createElement(sChildNodeNameTag);
        const oNodeValue = oDoc.createElement(sChildNodeValueTag);
        const sFmtValue = xValue instanceof Date ? xValue.toLocaleString("en-US", { timeZone: "UTC" }).replace(",", "") :
            xValue;
        oNodeName.textContent = sName;
        oNodeValue.textContent = sFmtValue;
        oNodeField.appendChild(oNodeName);
        oNodeField.appendChild(oNodeValue);
        return oNodeField;
    }
    const oXMLDocument = new Document();
    const oXMLSerializer = new XMLSerializer();
    const oNodeParameters = oXMLDocument.createElement(sRootNodeTag);

    for (let sKey in oData) {
        oNodeParameters.appendChild(_createFieldNode(oXMLDocument, sKey, oData[sKey]));
    }
    oXMLDocument.appendChild(oNodeParameters);
    return oXMLSerializer.serializeToString(oXMLDocument);
};
