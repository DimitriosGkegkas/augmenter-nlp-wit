import translate from "translate";
import { GoogleToken } from "../secret";
translate.engine = "google";
translate.key = GoogleToken;

import * as greekUtils from "greek-utils";

import * as fs from "fs";
import stopwords from "stopwords-el";

export default class Augmenter {
    dataset: IFAQdataset;
    datasetByTranslation: IFAQsubdataset;
    pathToSave: string;
    constructor(path: string) {
        this.dataset = {};
        this.datasetByTranslation = {};
        this.pathToSave = path;
        this.syncWithFile();
    }

    private inforceAllAugmentes(Content: string): string[] {
        return [
            this.filterStopword(Content),
            this.doubleWords(Content, this.filterStopword(Content)),
            this.shuffle(Content),
            this.hide(Content),
            this.shuffleAndHide(Content),
            this.addStopword(this.filterStopword(Content)),
            this.shuffleAndHide(this.filterStopword(Content)),
            this.hide(this.filterStopword(Content)),
            this.shuffle(this.filterStopword(Content)),
            this.doubleWords(
                this.filterStopword(Content),
                this.filterStopword(Content)
            ),
            this.doubleWords(
                this.shuffle(this.filterStopword(Content)),
                this.filterStopword(Content)
            ),
            this.doubleWords(
                this.shuffleAndHide(this.filterStopword(Content)),
                this.filterStopword(Content)
            ),
            this.addStopword(
                this.doubleWords(
                    this.filterStopword(Content),
                    this.filterStopword(Content)
                )
            ),
            this.addStopword(
                this.doubleWords(
                    this.shuffle(this.filterStopword(Content)),
                    this.filterStopword(Content)
                )
            ),
            this.addStopword(
                this.doubleWords(
                    this.shuffleAndHide(this.filterStopword(Content)),
                    this.filterStopword(Content)
                )
            ),
        ];
    }
    public getAugmentDataset(key: string, length: number): string[] {
        this.syncWithFile();
        if (this.datasetByTranslation === {})
            console.log("Not using Translation");

        const origin: string = this.dataset[key].qst;
        const originTr: string = this.datasetByTranslation[key];

        const result: string[] = [];

        while (result.length < length) {
            result.push(
                ...this.inforceAllAugmentes(origin),
                ...this.inforceAllAugmentes(originTr),
                ...this.inforceAllAugmentes(origin).map((Content) =>
                    greekUtils.toGreeklish(Content)
                ),
                ...this.inforceAllAugmentes(originTr).map((Content) =>
                    greekUtils.toGreeklish(Content)
                )
            );
        }
        return result;
    }

    public getReadyForTrain(key: string) {
        return this.getAugmentDataset(key, 50).map((Content: string) => {
            return this.serialize(Content, key);
        });
    }

    private syncWithFile() {
        try {
            this.dataset = JSON.parse(
                fs.readFileSync(this.pathToSave + "/dataset.json").toString()
            );
            this.datasetByTranslation = JSON.parse(
                fs
                    .readFileSync(
                        this.pathToSave + "/datasetByTranslation.json"
                    )
                    .toString()
            );
        } catch (err) {
            console.log("Could not load data from file");
        }
    }

    private updateFile() {
        console.log(this.pathToSave + "/dataset.json");
        try {
            fs.writeFileSync(
                this.pathToSave + "/dataset.json",
                JSON.stringify(this.dataset)
            );
            fs.writeFileSync(
                this.pathToSave + "/datasetByTranslation.json",
                JSON.stringify(this.datasetByTranslation)
            );
        } catch (err) {
            console.log("Could not save data to file");
        }
    }

    public push(faqs: IFAQkey[]) {
        faqs.forEach(
            ({ key, qst, ans }) =>
                (this.dataset[key] = { qst: qst.toLowerCase(), ans })
        );
        this.updateFile();
    }

    public async byTranslation() {
        if (this.dataset === {}) {
            console.log("No data to augment");
        }

        for (const key of Object.keys(this.dataset).filter(
            (key) => !this.datasetByTranslation[key]
        )) {
            this.datasetByTranslation[key] = await this.Translate(
                this.dataset[key].qst
            );
        }
        this.updateFile();
    }

    private async Translate(Content: string): Promise<string> {
        try {
            const ja: string = await translate(Content, {
                from: "el",
                to: "ja",
            });
            const es: string = await translate(ja, { from: "ja", to: "es" });
            console.log(await translate(es, { from: "es", to: "el" }));
            return await translate(es, { from: "es", to: "el" });
        } catch (err) {
            console.log(err);
            throw Error();
        }
    }

    private filterStopword(Content: string) {
        return Content.split(" ")
            .filter((word: string) => {
                return !stopwords.includes(word);
            })
            .join(" ");
    }

    private addStopword(Content: string) {
        return Content.split(" ")
            .map((word: string) => {
                if (randomNumber(100) > 70) {
                    const stopword: string =
                        stopwords[randomNumber(stopwords.length)];
                    return word + " " + stopword;
                } else {
                    return word;
                }
            })
            .join(" ");
    }

    private doubleWords(Content: string, ContentStrip: string) {
        return Content.split(" ")
            .map((word: string) => {
                if (randomNumber(100) > 70) {
                    const word: string =
                        ContentStrip.split(" ")[
                            randomNumber(ContentStrip.split(" ").length)
                        ];
                    return word + " " + word;
                } else {
                    return word;
                }
            })
            .join(" ");
    }

    private shuffle(Content: string): string {
        return Content.split(" ")
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
            .join(" ");
    }

    private hide(Content: string): string {
        return Content.split(" ")
            .map((value) => ({ value, sort: Math.random() }))
            .filter((a) => a.sort < 0.8)
            .map(({ value }) => value)
            .join(" ");
    }

    private shuffleAndHide(Content: string): string {
        return this.shuffle(this.hide(Content));
    }

    private serialize(Content: string, key: string) {
        return {
            text: Content,
            intent: key,
            entities: [],
            traits: [],
        };
    }
}

function randomNumber(max: number): number {
    return Math.floor(Math.random() * max);
}

interface IFAQ {
    qst: string;
    ans: string;
}

interface IFAQkey extends IFAQ {
    key: string;
}

interface IFAQdataset {
    [key: string]: IFAQ;
}

interface IFAQsubdataset {
    [key: string]: string;
}
