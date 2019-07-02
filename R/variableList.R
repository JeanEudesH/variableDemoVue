#-------------------------------------------------------------------------------
# Program: variableList.R
# Objective: retrieve data in suitable form for graph labelling
# Authors: Chourrout Elise
# Creation: 15/02/2019
# Last Update: 02/07/2019 J-E Hollebecq
#-------------------------------------------------------------------------------

#' @title Get Variable's Names from WS2 and formate them
#'
#' @importFrom phisWSClientR initializeClientConnection
#' @importFrom phisWSClientR getData
#' @importFrom phisWSClientR getVariablesDetails
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
#'  variableList(token = token)
#' }
variableList <- function(token, wsUrl = "www.opensilex.org/openSilexAPI/rest/"){
  phisWSClientR::initializeClientConnection(apiID="ws_private", url = wsUrl)


  # Recuperation of variables information
  rawVar <- phisWSClientR::getVariablesDetails(token = token)

  # Extraction of the information of interest
  methods <- rawVar$data$label
  names <- rawVar$data$label

  for (i in 1:length(names)){
    names[i] <- strsplit(methods[i], split="_")[[1]][1]
    methods[i] <- strsplit(methods[i], split="_")[[1]][2]
  }
  label <- rawVar$data$label
  acronyms <- rawVar$data$trait.label
  unitVar <- rawVar$data$unit.comment
  uriVar <- rawVar$data$uri

  # Creation of the dataTable with information of interest
  variableList <- data.frame( name = names, method = methods, acronym = acronyms, unity = unitVar, uri = uriVar, label = label)
  variableList <- data.frame(lapply(variableList, as.character), stringsAsFactors=FALSE)

  return(variableList)
}

