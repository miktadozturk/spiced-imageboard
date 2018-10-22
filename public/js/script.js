(function() {

    Vue.component('image-modal', {
        template: '#image-modal',
        props: ['id'],
        methods: {
            close1: function() {
                this.$emit('close2');
                location.hash = '';
            },
            submitcomment: function() {
                var self = this;
                axios.post('/submitcomment', {
                    comment: this.commentfield,
                    username: this.commenter,
                    id: this.id,
                }).then(function(response) {
                    var commentData = response.data.results.pop();
                    self.comments.push(commentData);
                    self.commentfield = '';
                    self.commenter = '';
                }).catch(function(err) {
                    console.log(err);
                });
            },
            displayModal: function() {
                var self = this;
                axios.get('/image-modal', {params: {id: this.id}})
                    .then(function(response) {
                        var c = response.data.comments;
                        var d = response.data.data[0];

                        location.hash = self.id;
                        if (Object.keys(d).length) {
                            self.url = d.url;
                            self.username = d.username;
                            self.title = d.title;
                            self.description = d.description;
                            self.created_at = d.created_at;
                            self.comments = c;
                        } else {
                            self.imageID = null;
                        }
                    }).catch(function() {
                        location.hash = '';
                        self.$emit('close2');
                    });
            }
        },
        mounted: function() {
            this.displayModal();
        },
        watch: {
            id: function() {
                this.displayModal();
            }
        },
        data: function() {
            return {
                url: '',
                username: '',
                title: '',
                description: '',
                created_at: '',
                comments: [],
                commentfield: '',
                commenter: ''
            };
        }
    });

    new Vue({
        el: '#main',
        data: {
            heading: 'My Photo Gallery',
            images: [],
            imageID: location.hash.slice(1),
            title: '',
            desc: '',
            username: '',
            file: '',
            hasMore: true
        },
        mounted: function() {
            var self = this;
            axios.get('/images').then(function(response) {
                if(!location.hash === null) {
                    self.images = response.data;
                } else {
                    self.images = response.data;
                }
            }).catch(function(err) {
                console.log(err);
            });

            addEventListener('hashchange', function() {
                if(location.hash != "") {
                    self.imageID = location.hash.slice(1);
                }
            });
        },
        methods: {
            handleFileChange: function(e) {
                this.fileInput = e.target;
                this.file = e.target.files[0];
            },
            getMore: function() {
                var instance = this;
                axios.get('/images/more/' + this.images[this.images.length-1].id)
                    .then(function(response) {
                        if(!response.data.length) {
                            instance.hasMore = false;
                        }
                        instance.images = instance.images.concat(response.data);
                    });
            },
            upload: function() {
                var formData = new FormData;
                formData.append('file', this.file);
                formData.append('desc', this.desc);
                formData.append('title', this.title);
                formData.append('username', this.username);

                var self = this;
                axios.post('/upload', formData).then(function(response) {
                    self.images.unshift(response.data[0]);
                    self.title = '';
                    self.desc = '';
                    self.username = '';
                    self.fileInput.value = '';
                }).catch(function(err) {
                    console.log(err);
                });
            },
            openModal: function(id) {
                this.imageID = id;
            },
            close3: function() {
                this.imageID = null;
            }
        }
    });

})();
