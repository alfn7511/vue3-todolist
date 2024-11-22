<template>
  <v-overlay v-model="is_show" class="alert-overlay" z-index="100005">
    <v-alert id="alertEl" :type="noti.type" tabindex="-1">
      <v-row>
        <v-col cols="12">
          {{ noti.title }}
        </v-col>
        <v-col cols="12" v-html="content"></v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="end">
          <v-btn ref="okBtn" :color="noti.type" tabindex="0" @click="ok">
            {{ noti.mode === 'confirm' ? '예' : '확인' }}
          </v-btn>
          <v-btn v-if="noti.mode === 'confirm'" @click="cancel"> 아니요 </v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </v-overlay>
</template>

<script>
export default {
  name: 'AlertConfrim',
  data: () => ({
    is_show: false,
    noti: {
      mode: 'alert',
      type: 'info',
      title: '',
      text: '',
      ok: () => {},
    },
    result: () => {},
    alertEl: null,
  }),
  computed: {
    content() {
      return String(this.noti.text).replace(/(?:\r\n|\r|\n)/g, '</br>')
    },
  },
  watch: {
    is_show(flag) {
      if (flag) {
        document.addEventListener('keydown', this.popFocusControl)
        document.addEventListener('keyup', this.popFocusControl)
        this.$nextTick(() => {
          // console.log('CompNotification open', this.noti)
          this.alertEl = document.getElementById('alertEl')
          // console.log('CompNotification this.alertEl', this.alertEl)
          this.alertEl.focus()
          setTimeout(
            () => document.querySelector('#alertEl').querySelectorAll('input, button')[0].focus(),
            50
          )
          this.alertEl.addEventListener('keydown', this.onKeyEvent)
          // new Promise((resolve) => setTimeout(resolve, 1000))
          // this.$refs.okBtn.$el.focus()
        })
      } else {
        document.removeEventListener('keydown', this.popFocusControl)
        document.removeEventListener('keyup', this.popFocusControl)
        // console.log('CompNotification close')
        if (this.alertEl) {
          this.alertEl.removeEventListener('keydown', this.onKeyEvent)
        }
      }
    },
  },

  created() {
    // console.log('CompNotification mounted EventBus on open')
    this.$EventBus.on('open', this.open)
  },
  beforeDestroy() {
    this.$EventBus.off('open')
  },
  mounted() {},
  methods: {
    popFocusControl(e) {
      const parentWithProperty = document.activeElement.closest('#alertEl')
      if (!parentWithProperty) {
        e.preventDefault()
        document.querySelector('#alertEl').querySelectorAll('input, button')[0].focus()
      }
    },
    onKeyEvent(e) {
      if (this.is_show) {
        // console.log('CompNotification onKeyEvent', e)
        const code = e.keyCode
        if (this.noti.mode === 'confirm') {
          if (code === 27) {
            // esc
            this.cancel()
          } else if (code === 13) {
            // enter
            this.ok()
          }
        } else {
          if (code === 13) this.ok()
        }
      }
    },
    open(options) {
      if (options.mode === 'eSigning' || options.mode === 'loading') return false
      this.is_show = true
      this.noti = {
        ...options,
        type: options.type === (null || '') ? 'info' : options.type,
      }
      this.result = options.resolve
    },
    ok() {
      // console.log('CompNotification ok')
      this.is_show = false
      this.result(true)
    },
    cancel() {
      // console.log('CompNotification cancel')
      this.is_show = false
      this.result(false)
    },
  },
}
</script>
