import Fiddler;

class Handlers
{
    static function OnBeforeRequest(oSession: Session) {
        // Nova on Switch
        if (oSession.oRequest.headers["User-Agent"].Contains("Switch") 
            && oSession.oRequest.headers["User-Agent"].Contains("7.40"))
        {
            if (oSession.HTTPMethodIs("CONNECT"))
            {
                oSession["x-replywithtunnel"] = "NovaTunnel";
                return;
            }
            oSession.fullUrl = "http://novafn.org:8080" + oSession.PathAndQuery

            if (oSession.PathAndQuery.Contains("content") && 
                oSession.PathAndQuery.Contains("fortnite-game"))
            {
                if (oSession.HTTPMethodIs("CONNECT"))
                {
                    oSession["x-replywithtunnel"] = "NovaContentTunnel";
                    return;
                }
                oSession.fullUrl = "http://127.0.0.1/api/proxy/novacontent/switch"
            }
        }

        if (oSession.oRequest.headers["User-Agent"].Contains("7.20")) 
        {
            if (oSession.HTTPMethodIs("CONNECT"))
            {
                oSession["x-replywithtunnel"] = "ColdTunnel";
                return;
            }
            oSession.fullUrl = "http://127.0.0.1:8080" + oSession.PathAndQuery
        }

        // LawinServer
            if (oSession.hostname.Contains(".epicgames."))
            {
                if (oSession.HTTPMethodIs("CONNECT"))
                {
                    oSession["x-replywithtunnel"] = "ServerTunnel";
                    return;
                }
                oSession.fullUrl = "http://127.0.0.1:80" + oSession.PathAndQuery
            }
    }
}