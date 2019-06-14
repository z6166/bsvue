export default{
    install(Vue,options)
    {
        Vue.prototype.logout = function () {
            this.$cookies.remove('token');
            this.$cookies.remove('username');
            this.$cookies.remove('uid');
            this.$router.go(0);
        };
        Vue.prototype.getTime = function (timestamp) {
            console.log("gettime");
            var d = new Date(timestamp);
            return (d.getFullYear()) + "-" +
                (d.getMonth() + 1) + "-" +
                (d.getDate()) + " " +
                (d.getHours()) + ":" +
                (d.getMinutes())
        };
        Vue.prototype.accessKey = 'c_z_GCgmtsRNcIZ3fHTY-1rv2Fwm4ZuRclHv3Nhs';
        Vue.prototype.secretKey = 'SUWR-z0HCx3ZOF2dPWbSP74LeLXP9e-GsHMvrfDY';
        Vue.prototype.bucket = "mypic";
        //Vue.prototype.baseurl = "106.15.197.60:8000";
        Vue.prototype.baseurl = "localhost:8000";
        Vue.prototype.publicBucketDomain = "psx59ycao.bkt.clouddn.com";
    }
}
