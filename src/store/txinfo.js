// Utilities
import { defineStore } from 'pinia'

export const useTxinfoStore = defineStore('txinfo', {
  state: () => ({
    /**
     * {
     *  id;
     *  hash;
     *  title;
     *  status;
     * }
     */
    txinfos: []
  }),
  actions: {
    updateTxinfos({ id, title, status, hash }) {
      const indx = this.txinfos.findIndex(t => t.id === id)
      if (indx !== -1) {
        this.txinfos.splice(indx, 1, { id, title, status, hash })
        setTimeout(() => {
          this.txinfos.splice(indx, 1)
        }, 5000);
      } else {
        this.txinfos.push({ id, title, status, hash })
      }
    },
    removeTxinfo({ id }) {
      const indx = this.txinfos.findIndex(t => t.id === id)
      if (indx !== -1) {
        this.txinfos.splice(indx, 1)
      }
    }
  }
})
