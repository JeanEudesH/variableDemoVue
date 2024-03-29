#-------------------------------------------------------------------------------
# Program: provenanceList.R
# Objective: list of different provenances within the data
# Authors: Jean-Eudes Hollebecq
# Creation: 21/06/2019
# Update:
#-------------------------------------------------------------------------------

#' @title Get provenance's Names from WS2 and formate them
#'
#' @importFrom phisWSClientR initializeClientConnection
#' @importFrom phisWSClientR getProvenances
#'
#' @param token a token from \code{\link{getToken}} function
#' @param wsUrl url of the webservice
#' @return WSResponse
#' @export
#'
#' @examples
#' \donttest{
#' initializeClientConnection(apiID="ws_private", url = "www.opensilex.org/openSilexAPI/rest/")
#'  aToken <- getToken("guest@opensilex.org","guest")
#'  token <- aToken$data
#'  provenanceList(token = token)
#' }
provenanceList <- function(token, wsUrl = "www.opensilex.org/openSilexAPI/rest/"){
  phisWSClientR::initializeClientConnection(apiID="ws_private", url = wsUrl)


  # Recuperation of variables information
  rawProvenances <- phisWSClientR::getProvenances(token = token)

  # Extraction of the information of interest
  label <- rawProvenances$data$label
  uri <- rawProvenances$data$uri

  # Creation of the dataTable with information of interest
  provenanceList <- data.frame(label = label, uri = uri)
  provenanceList <- data.frame(lapply(provenanceList, as.character), stringsAsFactors=FALSE)

  return(provenanceList)
}

