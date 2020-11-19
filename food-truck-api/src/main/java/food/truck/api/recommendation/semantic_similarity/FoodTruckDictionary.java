package food.truck.api.recommendation.semantic_similarity;

import lombok.extern.log4j.Log4j2;
import net.sf.extjwnl.JWNLException;
import net.sf.extjwnl.data.IndexWord;
import net.sf.extjwnl.data.POS;
import net.sf.extjwnl.dictionary.Dictionary;
import org.springframework.context.annotation.Bean;

/**
 * Facade to access extJWNL. Learned to use through: https://github.com/extjwnl/extjwnl
 */
@Log4j2
public class FoodTruckDictionary {

    /** Order of POSes to try, from most likely to least likely */
    private static final POS[] ATTEMPT = { POS.NOUN, POS.ADJECTIVE, POS.ADVERB, POS.VERB };

    /** extJWNL dictionary, for semantic analysis */
    private static final Dictionary dictionary;

    public static void main(String[] args) {
        FoodTruckDictionary ftd = new FoodTruckDictionary();
        System.out.println(ftd.wordsSemanticallyRelated("taco", "enchilada"));
    }

    /**
     * Load the dictionary
     */
    static {
        Dictionary tDict = null;
        try {
            tDict = Dictionary.getDefaultResourceInstance();
        } catch (JWNLException e) {
            log.error("Could not load dictionary for semantic similarity! No semantic fallback enabled", e);
        } finally {
            dictionary = tDict;
        }
    }

    public boolean wordsSemanticallyRelated(String word1, String word2) {
        if (dictionary != null) {
            IndexWord iword1 = null, iword2 = null;

            // Retrieve words
            try {
                iword1 = getWordFor(word1);
                iword2 = getWordFor(word2);
            } catch (JWNLException e) {
                log.error(String.format("Error thrown while getting index words for %s and %s", iword1, iword2), e);
            }

            // If one word not found, assume they can't be the same
            if (iword1 == null || iword2 == null)
                return false;

            // Run similarity analysis
            
        }

        // In the event of utter calamity, assume words not related and hope for the best
        return false;
    }

    /**
     * Translate the provided word into an IndexWord
     * @param word The word to translate
     * @return The IndexWord for the provided String, or null if no word found
     * @throws JWNLException If something dorks with JWNL. Seriously, I got nothing.
     */
    private IndexWord getWordFor(String word) throws JWNLException {
        IndexWord iWord;
        for (var pos : ATTEMPT) {
            iWord = dictionary.getIndexWord(pos, word);
            if (iWord != null)
                return iWord;
        }
        return null;
    }
}
