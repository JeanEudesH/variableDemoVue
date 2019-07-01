#-------------------------------------------------------------------------------
# Program: scientificObjectList.R
# Objective: list of different scientific objects within the data
# Authors: Jean-Eudes Hollebecq
# Creation: 1/07/2019
# Update:
#-------------------------------------------------------------------------------

#' @title Get scientific object's Names from WS2 and formate them
#'
#' @importFrom phisWSClientR initializeClientConnection
#' @importFrom phisWSClientR getScientificObjects
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
#'  scientificobjectList(token = token)
#' }
scientificobjectList <- function(token, wsUrl = "www.opensilex.org/openSilexAPI/rest/"){
  phisWSClientR::initializeClientConnection(apiID="ws_private", url = wsUrl)


  # Recuperation of variables information
  totalCount <- phisWSClientR::getScientificObjects(token = token)$totalCount
  rawScientificObjects <- phisWSClientR::getScientificObjects(token = token, pageSize = totalCount)

  # Extraction of the information of interest
  label <- rawScientificObjects$data$label
  uri <- rawScientificObjects$data$uri

  # Creation of the dataTable with information of interest
  ScientificObjectsList <- data.frame(label = label, uri = uri)
  ScientificObjectsList <- data.frame(lapply(ScientificObjectsList, as.character), stringsAsFactors=FALSE)

  return(ScientificObjectsList)
}

