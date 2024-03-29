% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/provenanceList.R
\name{provenanceList}
\alias{provenanceList}
\title{Get provenance's Names from WS2 and formate them}
\usage{
provenanceList(token, wsUrl = "www.opensilex.org/openSilexAPI/rest/")
}
\arguments{
\item{token}{a token from \code{\link{getToken}} function}

\item{wsUrl}{url of the webservice}
}
\value{
WSResponse
}
\description{
Get provenance's Names from WS2 and formate them
}
\examples{
\donttest{
initializeClientConnection(apiID="ws_private", url = "www.opensilex.org/openSilexAPI/rest/")
 aToken <- getToken("guest@opensilex.org","guest")
 token <- aToken$data
 provenanceList(token = token)
}
}
