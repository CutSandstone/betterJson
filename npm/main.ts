const order = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const revOrder: {[key: string]: number} = {};
for(let i = 0; i<order.length; i++) revOrder[order.charAt(i)] = i;
function stringify(obj: any){
    function fixName(s: string){
        s = s.replaceAll("\\", "\\\\");
        s = s.replaceAll("\n", "\\n");
        s = s.replaceAll("\t", "\\t");
        s = s.replaceAll("\r", "\\r");
        s = s.replaceAll(" ", "\\-");
        s = s.replaceAll("[", "\\[");
        s = s.replaceAll("]", "\\]");
        s = s.replaceAll(",", "\\,");
        s = s.replaceAll(":", "\\:");
        return s;
    }
    function toBase(n: number){
        let ans = "";
        while(n > 0){
            ans+=order.charAt(n%order.length);
            n = Math.floor(n/order.length);
        }
        return ans;
    }
    let ans = "";
    let stack: any[] = [obj];
    let m = new Map();
    m.set(obj, 0);
    let ind = 1;
    while(stack.length > 0){
        ans+="[";
        let curr = stack.pop();
        let comma = false;
        for(let key in curr){
            let val = curr[key];
            if(comma) ans+=",";
            comma = true;
            ans+=fixName(key)+":";
            switch(typeof val){
                case "object":
                    let put = -1;
                    if(m.has(val)) put = m.get(val);
                    else{
                        put = ind++;
                        m.set(val, put);
                        stack.push(val);
                    }
                    ans+=toBase(put);
                    break;
                case "string":
                    ans+="\""+fixName(val);
                    break;
                case "number":
                    ans+=val;
                    break;
                case "bigint":
                    ans+=val+"n";
                    break;
                case "boolean":
                    ans+=val ? "+":"-";
                    break;
                case "symbol":
                    ans+="S"+fixName(val.description);
                    break;
                case "undefined":
                    ans+="undefined";
                    break;
                case "function":
                    ans+="undefined";
                    break;
            }
        }
        ans+="]";
    }
    return ans;
}
function parse(s: string){
    function unFixName(s: string){
        s = s.replaceAll("\\[", "[");
        s = s.replaceAll("\\]", "]");
        s = s.replaceAll("\\:", ":");
        s = s.replaceAll("\\,", ",");
        s = s.replaceAll("\\-", " ");
        s = s.replaceAll("\\r", "\r");
        s = s.replaceAll("\\t", "\t");
        s = s.replaceAll("\\n", "\n");
        s = s.replaceAll("\\\\", "\\");
        return s;
    }
    function unBase(s: string){
        let ans = 0;
        for(let i = 0; i<s.length; i++)
            ans = ans*order.length+revOrder[s.charAt(i)];
        return ans;
    }
    let nodes: any[] = [];
    let keys: string[] = [];
    let slash = false;
    for(let c of s){
        if(!slash && c == "["){
            keys.push("");
            nodes.push({});
        }else if(slash || c != "]") keys[keys.length-1]+=c;
        if(c === "\\") slash = !slash;
        else slash = false;
    }
    for(let i = 0; i<nodes.length; i++){
        slash = false;
        let pairs: [string, string][] = [["",""]];
        let part = false;
        for(let c of keys[i]){
            if(!slash && c == ","){
                pairs.push(["",""]);
                part = false;
            }else if(!slash && c == ":") part = true;
            else pairs[pairs.length-1][part ? 1:0]+=c;
            if(c === "\\") slash = !slash;
            else slash = false;
        }
        for(let pair of pairs){
            let val;
            let v = pair[1];
            if(v.charAt(0) === "S") val = Symbol(unFixName(v.substring(1)));
            else if(v === "NaN") val = NaN;
            else if(v === "undefined") val = undefined;
            else if(v.charAt(0) === "\"") val = unFixName(v.substring(1));
            else if(v.charAt(v.length-1) === "n") val = BigInt(v.substring(0, v.length-1));
            else if(v === "+") val = true;
            else if(v === "-") val = false;
            else{
                let num = parseFloat(v);
                if(Number.isNaN(num)) val = nodes[unBase(v)];
                else val = num;
            }
            nodes[i][unFixName(pair[0])] = val;
        }
    }
    return nodes[0];
}