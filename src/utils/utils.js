export default {
    /**
     * Deeply compares two objects for equal keys and values
     * @returns {Boolean} true if both objects are "equal", false otherwise
     */
    objEquals: function(v1, v2) {
        var countProps = function(obj) {
            var count = 0;

            for (var k in obj) {
                if (obj.hasOwnProperty(k)) { count++; }
            }

            return count;
        };

        if (typeof (v1) !== typeof (v2)) { return false; }

        // Function equality
        if (typeof (v1) === "function") {  return v1.toString() === v2.toString(); }

        // Object equality
        if (v1 instanceof Object && v2 instanceof Object) {
            // Unequal keys
            if (countProps(v1) !== countProps(v2)) { return false; }

            var r = true;

            for (var k in v1) {
                r = this.objEquals(v1[k], v2[k]);

                // Value is unequal
                if (!r) { return false; }
            }
            return true;
        }
        // Base case, primitive is equal
        else {
            return v1 === v2;
        }
    },
    /**
     * Merge with obj2 fields taking priority
     */
    objPlus: function(obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    },
    /**
     * Merge using objPlus all objects passed in from left to right
     */
    objPlusAll: function(...objectArr) {
        // Passed in one array param
        if ((objectArr.length === 1) && (Array.isArray(objectArr[0]))) { objectArr = objectArr[0]; }

        var obj = {};
        for (var o in objectArr) { obj = this.objPlus(obj, objectArr[o]); }
        return obj;
    },
    /**
     * Merge with obj2 fields being used where obj1 fields don't exist, are undefined, or are null. Does not modify the passed in objects.
     * @param {boolean} ignoreAbsent if true, the fields in obj2 will not be added if they don't exist in obj1
     * @param {boolean} ignoreNull if true, the fields in obj2 will not be added if they are null in obj1
     */
    objDefaults: function(obj1, obj2, ignoreAbsent, ignoreNull) {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        return this.objFillDefaults(obj3, obj2, ignoreAbsent, ignoreNull);
    },
    /**
     * Merge obj2 fields into obj1 only where obj1 fields exist
     */
    objFill: function(obj1, obj2) {
        var obj1Keys = Object.keys(obj1);
        
        for (var attrname in obj2) {
            // Only merge if field is in obj1
            if (obj1Keys.indexOf(attrname) >= 0) { 
                obj1[attrname] = obj2[attrname]; 
            }
        }

        return obj1;
    },
    /**
     * Merge obj2 fields into obj1 where obj1 fields don't exist, are undefined, or are null.
     * @param {boolean} ignoreAbsent if true, the fields in obj2 will not be added if they don't exist in obj1
     * @param {boolean} ignoreNull if true, the fields in obj2 will not be added if they are null in obj1
     */
    objFillDefaults: function(obj1, obj2, ignoreAbsent, ignoreNull) {
        var obj1Keys = Object.keys(obj1);
        
        for (var attrname in obj2) {
            // Only merge if field is in obj1
            if (obj1Keys.indexOf(attrname) >= 0) {
                // Only merge defaults
                if (obj1[attrname] === (void 0) || (!ignoreNull && (obj1[attrname] === null))) {
                    obj1[attrname] = obj2[attrname];
                }
            }
            else if (!ignoreAbsent) {
                obj1[attrname] = obj2[attrname];
            }
        }

        return obj1;
    },
    /**
     * Remove the undefined or null values of an object. Does not modify the passed in object.
     * @param {object} obj the object to remove defaults. Does not modify.
     * @param {boolean} onlyIncludeUndefined if true, any fields with a value of null will not be removed
     * @returns {object} a shallow clone of the object where there are no fields with undefined values
     */
    objRemoveDefaults: function(obj, onlyIncludeUndefined) {
        var ret = {};

        for (var attrname in obj) {
            if (!((obj[attrname] === (void 0)) || (!onlyIncludeUndefined && obj[attrname] === null))) {
                ret[attrname] = obj[attrname];
            }
        }

        return ret;
    },
    // Underscore-contrib (underscore.object.builders.js 0.3.0)
    // (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
    // Underscore-contrib may be freely distributed under the MIT license.
    // Snapshots an object deeply. Based on the version by
    // [Keith Devens](http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone)
    objClone: function(obj) {
        if (obj == null || typeof(obj) != 'object') { return obj; }

        var temp = new obj.constructor();

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                temp[key] = this.objClone(obj[key]);
            }
        }

        return temp;
    },
    /**
     * Finds the index that an equal item for all fields would be in the array
     * @param {type} arr the array to search through
     * @param {type} obj to compare loosly equal to
     * @returns index of the first equal object in the array, -1 if no matches
     */
    arrIndexOfEqualObj(arr, obj) {
        if (this.isNil(arr) || this.isNil(obj) || arr.length <=0) {return -1;}
        
        // Ensure same exact object
        var tmp = arr.indexOf(obj);
        if (tmp >= 0) { return tmp; }
        
        for (var i in arr) {
            var item = arr[i];
            if (this.objEquals(item, obj)) { return i; }
        }

        return -1;
    },
    /**
     * @returns {boolean} true if the input object is null or undefined
     */
    isNil: function(obj) {
        return obj === null || obj === (void 0);
    },
    /**
     * @returns {Boolean} returns true if the input object is NOT null and NOT undefined
     */
    isNonNil: function(obj) {
        return !this.isNil(obj);
    },
    toTitleCase: function (text) {
        return text.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    },
    /**
     * Formats text to be safe in a human readable URL
     */
    toSafeURLString(text) {
        return text.replace(/[^a-z0-9-_~]*/gi, "");
    },
    /**
     * Returns the name of the file without the extension
     */
    getFilename(filenameWithExtension) {
        var tmp = filenameWithExtension.split(".");
        if (tmp.length > 1) { tmp.splice(-1,1); }
        return tmp.join(".");
    },
    /**
     * Returns the extension of the file without the name
     */
    getFilenameExtension(filename) {
        return fileName.split(".").pop();
    },
    /**
     * Returns the extension of a file within a URL
     */
    getExtensionFromURL(path) {
        return path.split(/\#|\?/)[0].split('.').pop().trim();
    },
    /**
     * Returns null if the string is nil or only whitespace, val otherwise
     */
    validVal(val) {
        return (this.isNil(val) || val.trim().length <= 0) ? null : val;
    },
    /**
     * Hash a string to a 32bit integer
     * Contributions from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     * @param {String} str the input string
     * @param {Integer} mod an optional number to modulus the output for bounding
     * @param {Boolean} signed flag to return the hash as a signed 32bit number, like java
     * @returns {Number} a 32bit integer representing a hash of the input string, optionally modded
     */
    hashString(str, mod, signed) {
        var hash = 0, 
            chr;

        if (str.length === 0) { return hash; }

        for (var i = 0; i < str.length; i++) {
            chr  = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash = hash & hash; // Convert to 32bit integer
        }

        // Change from signed to unsigned
        if (!signed) { hash = hash >>> 0; }

        return (mod && mod > 0) ? (hash % mod) : hash;
    },
    getPortalDomain(includeWholeBase) {
        var routeBase = process.env.routeBase;
        var tmp = (includeWholeBase) ? (location.origin) : (location.hostname.replace(/^www./, ""));
        var matchesRouteBase = new RegExp(routeBase+".*$", "i").test(location.pathname);

        if (matchesRouteBase) {
            var subfolder = location.pathname;
            var r = new RegExp(routeBase+".*$", "i");
            subfolder = subfolder.replace(r, "");
            tmp += subfolder;
        }

        return tmp;
    },
    getRouterBase() {
        var routeBase = process.env.routeBase;
        var matchesRouteBase = new RegExp(routeBase+".*$", "i").test(location.pathname);

        if (matchesRouteBase) {
            var subfolder = location.pathname;
            var r = new RegExp(routeBase+".*$", "i");
            subfolder = subfolder.replace(r, routeBase);
            return subfolder;
        }
        else {
            return null;
        }
    },
    getRelLink(url) {
        var routerBase = this.getRouterBase();
        var base = (this.isNil(routerBase)) ? ("") : (routerBase.replace(/\/$/, "") + "");
        return base + url;
    },
    getAbsLink(url) {
        return this.getPortalDomain(true) + url;
    },
    resource(path) {
        var base = (new RegExp(process.env.routeBase + ".*$", "i").test(location.pathname)) ? (process.env.resourceBase) : ("/");
        return this.getAbsLink(base + path);
    },
    async(func) {
        return setTimeout(func, 0);
    }
}
