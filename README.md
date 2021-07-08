# regex-subset-to-glob

Convert a minimal subset of regex to glob.

regex-subset-to-glob supports:
- `.*` to `*`
- `.`  to `?`
- `[abc]` and `[a-z]` (`.*` / `.` in brackets won't be touched)

Note that regex escaping (`\`) is not supported for now.

----

Additionally, regex-subset-to-glob-OR (this script) supports regex OR
by splitting the patterns into different strings:

> `"a|b|c"` to `["a", "b", "c"]`

But, regex matching groups is not supported,
so `"(a|b|c)"` will become `["(a", "b", "c)"]`;

Also, `"a|b|c"` to Extended globbing `"@(a|b|c)"` is not supported.

----

## Methods

<dl>
<dt><code>regexSubsetToGlob(regexStr: String): String</code></dt>
<dd>Takes a regular expression String, returns a glob pattern.</dd>
<dt><code>regexSubsetToGlobOR(regexStr): [String, ...]</code></dt>
<dd>Takes a regular expression String, returns an Array of glob pattern(s).</dd>
</dl>

## Example

``` JavaScript
import regexSubsetToGlob   from "./regex-subset-to-glob.js";
import regexSubsetToGlobOR from "./regex-subset-to-glob-OR.js";

(regexSubsetToGlob(".*-[to][o-t]-....") + ".js") === "*-[to][o-t]-????.js";

regexSubsetToGlob("test\\.js") === "test\\?js"; // `\` is not supported for now

regexSubsetToGlob("LICENSE|[A|B]") === "LICENSE|[A|B]";
regexSubsetToGlobOR("LICENSE|[A|B]").join(" & ") === "LICENSE & [A|B]";
```