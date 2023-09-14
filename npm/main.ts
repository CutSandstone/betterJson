(function main() {
    const order = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const revOrder: {[key: string]: number} = {};
    for(let i = 0; i<order.length; i++) revOrder[order.charAt(i)] = i;
    function stringify(obj: any){
        function fixName(s: string){
            s = s.replaceAll("\\", "\\\\");
            s = s.replaceAll("\n", "\\n");
            s = s.replaceAll("\t", "\\t");
            s = s.replaceAll("\r", "\\r");
            s = s.replaceAll("\b", "\\b");
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
        let ind = 0;
        while(stack.length > 0){
            ans+="[";
            let curr = stack.pop();
            let comma = false;
            for(let key in curr){
                let val = curr[key];
                if(comma) ans+=",";
                comma = false;
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
                        ans+="\""+val+"\"";
                        break;
                    case "number":
                        ans+=val;
                        break;
                    case "bigint":
                        ans+=val;
                        break;
                    case "boolean":
                        ans+=val ? "+":"-";
                        break;
                    case "symbol":
                        break;
                    case "undefined":
                        break;
                    case "function":
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
            s = s.replaceAll("\\b", "\b");
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
        let ans = {};
        
        return ans;
    }
    // let object: any = {"XYZ": {"BZ": "3"}, "ABC":4};
    // object["ABZ"] = object["XYZ"];
    // let str = stringify(object);
    // console.log(str);
    console.log(JSON.stringify(Symbol("description")));
}());