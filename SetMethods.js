// Adding some methods to Set                                            

class SetMethods {

    static areEqual(A, B) {
        if (B.size !== A.size) return false;
        for (let el of B) {
            if (!A.has(el)) {
                return false;
            }
        }
        return true;
    }


    static union(A, B) {
        const C = new Set();
        for (let el of A) {
            C.add(el);
        }
        for (let el of B) {
            C.add(el);
        }
        return C;
    }


    static intersection(A, B) {
        const C = new Set();
        for (let el of A) {
            if (B.has(el)) {
                C.add(el);
            }
        }
        return C;
    }

    static isSubset(A, B) {
        if (A.size > B.size) {
            return false;
        }
        for (let el of A) {
            if (!B.has(el)) {
                return false;
            }
        }
        return true;
    }

    static isProperSubset(A, B) {
        if (A.size >= B.size) {
            return false;
        }
        for (let el of A) {
            if (!B.has(el)) {
                return false;
            }
        }
        return true;
    }

    static difference(A, B) {
        const C = new Set();
        for (let el of A) {
            if (!B.has(el)) {
                C.add(el);
            }
        }
        return C;
    }

    static symmetricDifference(A, B) {
        const union = SetMethods.union(A, B);
        const intersection = SetMethods.intersection(A, B);
        return union.difference(intersection);
    }

    /**
     * Takes two sets and determines if the first has the second as an element
     * @param {Set} A 
     * @param {Set} B 
     * @returns {Boolean}
     */
    static hasSetAsElement(A, B) {
        for (let el of A) {
            if (SetMethods.areEqual(el, B)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Takes two sets and adds the second to the first providing no Set Element within the first is equal to the new set
     * @param {Set} A 
     * @param {Set} B 
     */
    static addSet(A,B){
        if(!SetMethods.hasSetAsElement(A,B)){
            A.add(B);
        }
    }

    static powerSet(A) {
        let powerSet = new Set();
        for (let el1 of A) {
            let runningArr = [el1];
            powerSet.add(new Set().add(el1));
            for (let el2 of A) {
                if (el2 === el1) continue;
                runningArr.push(el2);
                SetMethods.addSet(powerSet, new Set(runningArr));
            }
        }
        powerSet.add(new Set());
        return powerSet;
    }

}

module.exports = SetMethods;