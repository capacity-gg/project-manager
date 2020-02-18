<template>
    <div class="vue-csv-uploader">
        <div class="form">
            <div class="form-group csv-import-file">
                <input 
                    class="form-control-file" 
                    type="file" 
                    name="csv"
                    ref="csv" 
                    @change.prevent="validFileMimeType" 
                >
                <slot name="error" v-if="hasError">
                    <div class="invalid-feedback">File type is invalid</div>
                </slot>
                <div class="form-group" v-if="canSubmit">
                    <slot name="submit" :load="load">
                        <div class="fc-button fc-button--primary" @click.prevent="load">Import</div>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import lodash from 'lodash';
import papa from 'papaparse';
import mimeTypes from "mime-types";

export default {
    props: {
        value: Array,
        callback: {
            type: Function,
            default: () => ({})
        },
        validation: {
            type: Boolean,
            default: true,
        },
        fileMimeTypes: {
            type: Array,
            default: () => {
                return ["text/csv", "text/x-csv", "application/vnd.ms-excel", "text/plain"];
            }
        }
    },
    data: () => ({
        form: {
            csv: null,
        },
        map: {
          "title": 0,
          "date": 1
        },
        csv: null,
        isValidFileMimeType: false,
        fileSelected: false
    }),
    computed: {
        hasError() {
            return this.fileSelected && !this.isValidFileMimeType;
        },
        canSubmit() {
            return this.isValidFileMimeType;
        }
    },
    watch: {
      csv: function(newVal) {
        if (newVal.length > 0) {
            this.submit();
        }
      }
    },
    methods: {
        buildMappedCsv() {
            var self = this;
            var csv = lodash.drop(self.csv);

            return lodash.map(csv, (row) => {
                let newRow = {};

                lodash.forEach(self.map, (column, field) => {
                    lodash.set(newRow, field, lodash.get(row, column));
                });

                return newRow;
            });
        },
        validFileMimeType() {
            let file = this.$refs.csv.files[0];
            const mimeType = file.type === "" ? mimeTypes.lookup(file.name) : file.type;

            if (file) {
                this.fileSelected = true;
                this.isValidFileMimeType = this.validation ? this.validateMimeType(mimeType) : true;
            } 
            else {
                this.isValidFileMimeType = !this.validation;
                this.fileSelected = false;
            }
        },
        validateMimeType(type) {
            return this.fileMimeTypes.indexOf(type) > -1;
        },
        load() {
            const self = this;

            self.readFile((output) => {
                self.csv = lodash.get(papa.parse(output, { skipEmptyLines: true }), "data");
            });
        },
        submit() {
            const self = this;

            self.form.csv = self.buildMappedCsv();
            self.$emit('input', self.form.csv);
            self.callback(self.form.csv);
        },
        readFile(callback) {
            let file = this.$refs.csv.files[0];

            if (file) {
                let reader = new FileReader();                
                reader.readAsText(file, "UTF-8");
                reader.onload = function(evt) { callback(evt.target.result); };
                reader.onerror = function() {};
            }
        }
    }
};

</script>

<style lang='scss' scoped>

.csv-import-file {
  background: #eee;
  border: 1px solid #ccc;
  display: block;
  height: auto;
  min-height: 60px;
  padding: 10px;
}

.form-control-file {
  padding: 10px;
  position: relative;
  top: 10px;
}

.invalid-feedback {
  color: #ff0000;
  font-size: 12px;
  margin: 6px 0;
}

</style>
