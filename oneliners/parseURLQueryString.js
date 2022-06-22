/**
* SAP UI5 Tool: Parses URL query string and returns object
* @author Lautaro Capella <laucape@gmail.com>
*/
const oQueryParams = window.location.search.replace(/^\?/,"").split("&").reduce((oRet,sParam) => ({...oRet, [sParam.split("=")[0]]: sParam.split("=")[1]}),{});
