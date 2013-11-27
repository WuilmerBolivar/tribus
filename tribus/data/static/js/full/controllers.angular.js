// Declare use of strict javascript
'use strict';

function UserController($scope, UserProfile){
    $scope.user_gravatar = user_gravatar;
    $scope.userview_gravatar = userview_gravatar;

    
    var user_follow = UserProfile.query({id:user_id},function(){
        $scope.add = false;
        for (var i = 0; i < user_follow[0].follows.length; i++ ){
            if (user_follow[0].follows[i] ==  "/api/0.1/user/details/" + userview_id){
                $scope.add = true;
                break;
                
            }
            
        }     
        console.log("iniciado add ", $scope.add);
    });


    $scope.follow = function(){
        var agregado = false;

        var profile = UserProfile.query({id:user_id},function(){
            var profileview = UserProfile.query({id:userview_id},function(){
                console.log(profile, profileview);


                // console.log("/api/0.1/user/profile/"+userview_id); 
                for (var ind = 0; ind<profile[0].follows.length; ind++){
                    if (profile[0].follows[ind] == "/api/0.1/user/details/" + userview_id){
                        console.log("----->  ELIMINADO.", profile);

                        profileview[0].followers.pop(ind);
                        profileview[0].$modify({author_id: userview_id});

                        profile[0].follows.pop(ind);
                        profile[0].$modify({author_id: user_id});
                        agregado = true;
                        $scope.add = false;

                        break;
                    }
                }
                if (agregado == false){                 

                    $scope.add= true;
                    profileview[0].followers.push("/api/0.1/user/details/"+user_id);
                    profileview[0].$modify({author_id: userview_id});
                    console.log("----->  AGREGADO.", profileview); 
                    profile[0].follows.push("/api/0.1/user/details/"+userview_id);
                    profile[0].$modify({author_id: user_id});


                }
                // if (agregado ==false){

                // }
                // else{
                //     profileview[0].followers.pop(indidce);
                //     profileview[0].$modify({author_id: userview_id});
                // }
                
            });             
});
        // $scope.$watch($scope.add,function(){
        // console.log($scope.add, "-----");
        // });  

};


    // $scope.$watch($scope.add,function(){
    // console.log($scope.add, "-----");
    // });    
}

function FollowsController($scope, $filter, UserFollows, UserProfile, $timeout ){
    $scope.actualizar = false;
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.follows = UserFollows.query({},function(){
        $scope.$watch('query',function(){
            $scope.currentPage = 0;
            $scope.filtername = $filter('filter')($scope.follows, $scope.query);
            $scope.numberOfPages=function(){
                return Math.ceil($scope.filtername.length / $scope.pageSize);
                $scope.follows = $scope.filtername;

            }

        });
        // $scope.$watch('actualizar',function(){
        //     console.log('cambio')
        //     $timeout(function(){$(".follows_list").trigger('reload_dom');});
        //     $scope.actualizar = false;
        // });
    });

    $scope.convertmd5 = function(email){
        var url = 'http://www.gravatar.com/avatar/'+md5(email)+'?d=mm&s=70&r=x';
        return url
    };

    $scope.eliminar = function(Uid){
        console.log(Uid , user_id);
        var profile = UserProfile.query({id:user_id},function(){
            var profileview = UserProfile.query({id:Uid},function(){

                for (var i =0; i < profile[0].follows.length; i++){
                    if (profile[0].follows[i]== "/api/0.1/user/details/" + Uid){

                            profileview[0].followers.pop(i);
                            profileview[0].$modify({author_id: Uid});

                            profile[0].follows.pop(i);
                            profile[0].$modify({author_id:user_id}); 
                            $scope.follows.splice(i,1);
                            //$scope.actualizar = true;
                        break;
                    }
                }
            });
        });
    };
};

function FollowersController($scope, $filter, UserFollowers,UserProfile ){
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.followers = UserFollowers.query({},function(){
        $scope.$watch('query2',function(){
            $scope.currentPage = 0;
            $scope.filtername = $filter('filter')($scope.followers, $scope.query2);
            $scope.numberOfPages=function(){
                return Math.ceil($scope.filtername.length / $scope.pageSize);
                $scope.followers = $scope.filtername;

            }

        });
    });
    $scope.convertmd5 = function(email){
        var url = 'http://www.gravatar.com/avatar/'+md5(email)+'?d=mm&s=70&r=x';
        return url
    }; 

};


function SearchListController($scope, Search){
    $scope.package_results = [];
    $scope.users_results = [];
    
    $scope.hasPackages = function(){
        return $scope.package_results.length > 0;
    };
    
    $scope.hasUsers = function(){
        return $scope.users_results.length > 0;
    };
    
    $scope.noResults = function(){
        return !$scope.hasUsers() && !$scope.hasPackages();
    };

    $scope.refreshResults = function(){
        if (($scope.top_search != undefined) && ($scope.top_search.length > 1)) {
            $scope.no_results = false;
            $scope.package_results = [];
            $scope.users_results = [];
            var q = Search.query(
                {
                    q: $scope.top_search
                }, function(){
                    $scope.package_results = [];
                    $scope.users_results = [];
                    if (q.objects[0].packages.length > 0) {
                        var packages = q.objects[0].packages;
                        for(var i = 0; i < packages.length; i++){
                            packages[i].url = packages_url_placer.replace('%PACKAGE%', packages[i].name);
                            $scope.package_results.push(packages[i]);
                        }
                    }
                    
                    if (q.objects[0].users.length > 0) {
                        var users = q.objects[0].users;
                        for(var i = 0; i < users.length; i++){
                            users[i].url = user_url_placer.replace('%PACKAGE%', users[i].username);
                            $scope.users_results.push(users[i]);
                        }
                    }
                    //console.log($scope.package_results);
                    //console.log($scope.users_results);
                }
            );
        }
    };
};


function ModalController($scope, $modalInstance){
    $scope.ok = function(){$modalInstance.close();};
    $scope.cancel = function(){$modalInstance.dismiss();};
};


function TribController($scope, $timeout, $modal, Tribs, Timeline){

    $scope.template_name = template_name;
    $scope.user_gravatar = user_gravatar;
    $scope.comment_gravatar = comment_gravatar;
    $scope.controller_busy = controller_busy;
    $scope.trib_limit_to = trib_limit_to;
    $scope.trib_limit = trib_limit;
    $scope.trib_offset = trib_offset;
    $scope.trib_orderby = trib_orderby;
    $scope.tribs = [];
    $scope.first_trib_id = '';
    $scope.new_tribs_passes = 0;
    $scope.new_tribs_offset = trib_offset;
    $scope.alerts = [];

    $scope.addAlert = function(alert_msg, alert_type) {
        var alert = {
            type: alert_type,
            msg: alert_msg
        }
        $scope.alerts.push(alert);
        $timeout(function(){
            $scope.closeAlert($scope.alerts.indexOf(alert));
        }, 5000);
    };

    $scope.closeAlert = function(index){
        $scope.alerts.splice(index, 1);
    };

    $scope.createNewTrib = function(){
        Tribs.save({
            author_id: user_id,
            author_username: user_username,
            author_first_name: user_first_name,
            author_last_name: user_last_name,
            author_email: user_email,
            trib_content: $scope.trib_content,
            trib_pub_date: new Date().toISOString()
        }, function(e){
            $scope.trib_content = '';
            $timeout(function(){
                $scope.addNewTribs();
            });
            $timeout(function(){
                angular.element(document.querySelector('textarea.action_textarea'))
                    .triggerHandler('blur');
            });
            $timeout(function(){
                $scope.addAlert(trib_save_success, 'success');
            }, 100);
        }, function(e){
            $timeout(function(){
                $scope.addAlert(trib_save_error, 'error');
            }, 100);
        });
    };

    $scope.pollNewTribs = function(){
        $timeout(function(){
            $timeout(function(){$scope.addNewTribs();});
            $timeout(function(){$scope.pollNewTribs();});
        }, 60000);
    };

    $scope.toggleComments = function(){
        if($scope.tribs[this.$index].coments_show === false ||
           $scope.tribs[this.$index].coments_show === undefined){
            $scope.tribs[this.$index].coments_show = true;
        } else {
            $scope.tribs[this.$index].coments_show = false;
        }
    };

    $scope.showDeleteModal = function(){
        $scope.delete_trib_id = $scope.tribs[this.$index].id;
        $scope.delete_trib_index = this.$index;

        var modal = $modal.open({
            templateUrl: 'delete_modal_template.html',
            controller: ModalController,
        });

        modal.result.then(function(){
            Tribs.delete({
                id: $scope.delete_trib_id
            }, function(e){
                $scope.tribs.splice($scope.delete_trib_index, 1);
                $timeout(function(){
                    $scope.addAlert(trib_delete_success, 'success');
                }, 100);
            }, function(e){
                $timeout(function(){
                    $scope.addAlert(trib_delete_error, 'error');
                }, 100);
            });
        });
    };

    $scope.addOldTribs = function(){
        if ($scope.tribs_end) return;
        if ($scope.controller_busy) return;
        $scope.controller_busy = true;

        if (template_name === 'profile'){
            
            var service = Tribs;
            var querydict = {
                author_id : user_id,
                order_by: $scope.trib_orderby,
                limit: $scope.trib_limit,
                offset: $scope.trib_offset
            };
        } else if(template_name === 'profileView'){
            
            var service = Tribs;
            var querydict = {
                author_id : userview_id,
                order_by: $scope.trib_orderby,
                limit: $scope.trib_limit,
                offset: $scope.trib_offset
            };
        } else if (template_name === 'dashboard'){
            
            var service = Timeline;
            var querydict = {
                order_by: $scope.trib_orderby,
                limit: $scope.trib_limit,
                offset: $scope.trib_offset
            };
        };


        var old_tribs = service.query(querydict, function(){
            if(old_tribs.objects.length === 0){
                $scope.tribs_end = true;
                $scope.controller_busy = false;
            } else {
                $scope.tribs_end = false;
                for(var i = 0; i < old_tribs.objects.length; i++){
                    var old_id_appears = false;

                    for(var j = 0; j < $scope.tribs.length; j++){
                        if(old_tribs.objects[i].id == $scope.tribs[j].id){
                            old_id_appears = true;
                        }
                    }

                    if(!old_id_appears){
                        old_tribs.objects[i].author_gravatar = 'http://www.gravatar.com/avatar/';
                        old_tribs.objects[i].author_gravatar += md5(old_tribs.objects[i].author_email);
                        old_tribs.objects[i].author_gravatar += '?d=mm&s=70&r=x';
                        $scope.tribs.push(old_tribs.objects[i]);
                    }
                }

                if($scope.tribs.length > $scope.trib_offset){
                    $scope.trib_offset = $scope.trib_offset + trib_add;
                }

                if($scope.tribs.length > $scope.trib_limit_to){
                    $scope.trib_limit_to = $scope.tribs.length;
                }

                $timeout(function(){
                    angular.element(document.querySelector('div.trib_list'))
                        .triggerHandler('reload_dom');
                });

                $scope.controller_busy = false;
            }
        }, function(e){
            console.log(e);
            $timeout(function(){
                $scope.addAlert(trib_add_error, 'error');
            }, 100);
        });
    };

    $scope.addNewTribs = function(selector){

        if ($scope.controller_busy) return;
        $scope.controller_busy = true;

        if($scope.new_tribs_passes === 0 && $scope.tribs.length > 0){
            $scope.first_trib_id = $scope.tribs[0].id;
        }

        if (template_name === 'profile'){
            var service = Tribs;
            var querydict = {
                author_id : user_id,
                order_by: $scope.trib_orderby,
                limit: $scope.trib_limit,
                offset: $scope.new_tribs_offset
            };
        } else if(template_name === 'profileView'){
            var service = Tribs;
            var querydict = {
                author_id : userview_id,
                order_by: $scope.trib_orderby,
                limit: $scope.trib_limit,
                offset: $scope.new_tribs_offset
            };
        } else if (template_name === 'dashboard'){
            var service = Timeline;
            var querydict = {
                order_by: $scope.trib_orderby,
                limit: $scope.trib_limit,
                offset: $scope.new_tribs_offset
            };
        };

        console.log(template_name);
        console.log(service);
        
        var fresh_tribs = service.query(querydict,function(){
            for(var i = 0; i < fresh_tribs.objects.length; i++){
                if(fresh_tribs.objects[i].id != $scope.first_trib_id){
                    var fresh_id_appears = false;

                    for(var j = 0; j < $scope.tribs.length; j++){
                        if(fresh_tribs.objects[i].id == $scope.tribs[j].id){
                            fresh_id_appears = true;
                        }
                    }

                    if(!fresh_id_appears){
                        fresh_tribs.objects[i].author_gravatar = 'http://www.gravatar.com/avatar/';
                        fresh_tribs.objects[i].author_gravatar += md5(fresh_tribs.objects[i].author_email);
                        fresh_tribs.objects[i].author_gravatar += '?d=mm&s=70&r=x';
                        $scope.tribs.unshift(fresh_tribs.objects[i]);
                    }

                    if($scope.tribs.length > $scope.trib_limit_to){
                        $scope.trib_limit_to = $scope.tribs.length;
                    }

                    if(i == (fresh_tribs.objects.length-1)){
                        $scope.new_tribs_offset = $scope.new_tribs_offset + trib_add;
                        $scope.new_tribs_passes = $scope.new_tribs_passes + 1;
                        $timeout(function(){$scope.addNewTribs();});
                    }
                } else {
                    $scope.new_tribs_offset = trib_offset;
                    $scope.new_tribs_passes = 0;
                    break;
                }
            }

            $timeout(function(){
                angular.element(document.querySelector('div.trib_list'))
                    .triggerHandler('reload_dom');
            });

            $scope.controller_busy = false;

        }, function(e){
            $timeout(function(){
                $scope.addAlert(trib_add_error, 'error');
            }, 100);
        });
    };
}


function CommentController($scope, $timeout, $modal, Comments){

    $scope.comment_limit_to = comment_limit_to;
    $scope.comment_limit = comment_limit;
    $scope.comment_offset = comment_offset;
    $scope.comment_orderby = comment_orderby;
    $scope.comments = [];
    $scope.new_comments_offset = comment_offset;
    $scope.new_comments_passes = 0;

    $scope.createNewComment = function(){
        Comments.save({
            author_id: user_id,
            author_username: user_username,
            author_first_name: user_first_name,
            author_last_name: user_last_name,
            author_email: user_email,
            comment_content: this.comment_content,
            comment_pub_date: new Date().toISOString(),
            trib_id: $scope.trib_id
        }, function(){
            $scope.comment_content = '';
            $timeout(function(){
                $scope.addNewComments();
            });
            $timeout(function(){
                angular.element(document.querySelector('textarea.comment_textarea'))
                    .triggerHandler('keyup');
                angular.element(document.querySelector('textarea.comment_textarea'))
                    .triggerHandler('focus');
            });
            $timeout(function(){
                $scope.addAlert(comment_save_success, 'success');
            }, 100);
        }, function(){
            $timeout(function(){
                $scope.addAlert(comment_save_error, 'error');
            }, 100);
        });
    };

    $scope.showDeleteModal = function(){
        $scope.delete_comment_id = this.comment.id;
        $scope.delete_comment_index = $scope.comments.length - this.$index - 1;

        var deleteCommentModal = $modal.open({
            templateUrl: 'delete_modal_template.html',
            controller: ModalController,
        });

        deleteCommentModal.result.then(function(){
            Comments.delete({
                id: $scope.delete_comment_id
            }, function(e){
                $scope.comments.splice($scope.delete_comment_index, 1);
                $timeout(function(){
                    $scope.addAlert(comment_delete_success, 'success');
                }, 100);
            }, function(e){
                $timeout(function(){
                    $scope.addAlert(comment_delete_error, 'error');
                }, 100);
            });
        });
    };

    function itemInArray(item, a){
        for (var i = 0; i < a.length; i++){
            if (a[i].id === item.id){
                return true;
            }
        }
        return false;
    }

    $scope.addNewComments = function(){
        if($scope.controller_busy) return;
        $scope.controller_busy = true;

        if($scope.new_comments_passes === 0 && $scope.comments.length > 0){
            $scope.first_comment_id = $scope.comments[0].id;
        }

        Comments.query({
            trib_id: $scope.trib_id,
            order_by: '-'+$scope.comment_orderby,
            limit: $scope.comment_limit,
            offset: $scope.new_comments_offset
        }, function(results){
            if(results.objects.length != 0){
                for(var i = 0; i < results.objects.length; i++){
                    if(results.objects[i].id != $scope.first_comment_id){
                        if(!itemInArray(results.objects[i], $scope.comments)){
                            results.objects[i].author_gravatar = 'http://www.gravatar.com/avatar/';
                            results.objects[i].author_gravatar += md5(results.objects[i].author_email);
                            results.objects[i].author_gravatar += '?d=mm&s=30&r=x';
                            $scope.comments.unshift(results.objects[i]);
                        }

                        if($scope.comments.length > $scope.comment_limit_to){
                            $scope.comment_limit_to = $scope.comments.length;
                        }

                        if(i == (results.objects.length-1)){
                            $scope.new_comments_offset = $scope.new_comments_offset + comment_add;
                            $scope.new_comments_passes = $scope.new_comments_passes + 1;
                            $timeout(function(){$scope.addNewComments();});
                        }
                    } else {
                        $scope.new_comments_offset = comment_offset;
                        $scope.new_comments_passes = 0;
                        break;
                    }
                }
            }

            $timeout(function(){
                angular.element(document.querySelector('div.trib_list'))
                    .triggerHandler('reload_dom');
            });

            $scope.controller_busy = false;

        }, function(error){
            $timeout(function(){
                $scope.addAlert(comment_add_error, 'error');
            }, 100);
        });
    };

    $scope.addOldComments = function(){
        if ($scope.comments_end) return;
        if($scope.controller_busy) return;
        $scope.controller_busy = true;

        Comments.query({
            trib_id: $scope.trib_id,
            order_by: '-'+$scope.comment_orderby,
            limit: $scope.comment_limit,
            offset: $scope.comment_offset
        }, function(results){
            if(results.objects.length != 0){
                for(var i = 0; i < results.objects.length; i++){
                    if(results.objects[i].id != $scope.first_comment_id){
                        if(!itemInArray(results.objects[i], $scope.comments)){
                            results.objects[i].author_gravatar = 'http://www.gravatar.com/avatar/';
                            results.objects[i].author_gravatar += md5(results.objects[i].author_email);
                            results.objects[i].author_gravatar += '?d=mm&s=30&r=x';
                            $scope.comments.push(results.objects[i]);
                        }

                        if($scope.comments.length > $scope.comment_limit_to){
                            $scope.comment_limit_to = $scope.comments.length;
                        }

                        if($scope.comments.length > $scope.comment_offset){
                            $scope.comment_offset = $scope.comment_offset + comment_add;
                        }
                    } else {
                        $scope.comment_offset = comment_offset;
                        $scope.new_comments_passes = 0;
                        break;
                    }
                }
            } else {
                $scope.comments_end = true;
            }

            $timeout(function(){
                angular.element(document.querySelector('div.trib_list'))
                    .triggerHandler('reload_dom');
            });

            $scope.controller_busy = false;

        }, function(error){
            $timeout(function(){
                $scope.addAlert(comment_add_error, 'error');
            }, 100);
        });
    };
};