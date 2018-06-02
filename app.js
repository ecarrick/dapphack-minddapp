// const dsteem = require('dsteem');
let opts = {};

//connect to community testnet
opts.addressPrefix = 'STX';
opts.chainId =
    '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
//connect to server which is connected to the network/testnet
const client = new dsteem.Client('https://testnet.steem.vc', opts);

const mainTag = 'minddappquestion';
const server  = 'http://condenser.steem.vc';

window.getPosts = async (filter) => {
    console.log("get posts");
    //const filter = mainTag;
    const query = {
        tag: mainTag,
        limit: 5,
    };

    client.database.getDiscussions("created", query)
    .then(result => {
        console.log("Response received:", result);
        if (result) {
            var posts = [];
            result.forEach(post => {
                
                const json = JSON.parse(post.json_metadata);
                console.log(post, !!filter);
                if(!filter){
                    const image = json.image ? json.image[0] : '';
                    const title = post.title;
                    const author = post.author;
                    const created = new Date(post.created).toDateString();
                    posts.push(
                        `<div class="question">
                            <table>
                                <tbody>
                                <tr>
                                    <td class="post">
                                    <img class="post_image" src="img/blockchain.jpeg"/>
                                    </td>
                                    <td>
                                    <h3><a href="${server}${post.url}">${author} asked ${created}</a></h3>
                                    <p class="content">
                                    ${title}
                                    </p>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>`
                    );
                }
                else if(json.tags.includes(filter)){
                    const image = json.image ? json.image[0] : '';
                    const title = post.title;
                    const author = post.author;
                    const created = new Date(post.created).toDateString();
                    posts.push(
                        `<div class="question">
                            <table>
                                <tbody>
                                <tr>
                                    <td class="post">
                                    <img class="post_image" src="../img/blockchain.jpeg"/>
                                    </td>
                                    <td>
                                    <h3><a href="${server}${post.url}">${author} asked ${created}</a></h3>
                                    <p class="content">
                                    ${title}
                                    </p>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>`
                    );
                }
                
            });

            document.getElementById('postList').innerHTML = posts.join('');
        } else {
            document.getElementById('postList').innerHTML = "No result.";
        }
    });
};

//submit post function
window.submitPost = async () => {
    console.log("button clicked");
    //get private key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    console.log("get transfer key");
    const transferKey = dsteem.PrivateKey.fromString(
        document.getElementById('transferKey').value
    );
    console.log("done transfer")
    const bounty = document.getElementById('bounty').value;
    //get account name
    const account = document.getElementById('username').value;
    //get title
    const title = document.getElementById('title').value;
    //get body
    const body = document.getElementById('body').value;
    //get tags and convert to array list
    const tags = mainTag+" "+document.getElementById('tags').value;
    const taglist = tags.split(' ');
    //make simple json metadata including only tags
    const json_metadata = JSON.stringify({ tags: taglist });
    //generate random permanent link for post
    const permlink = Math.random()
        .toString(36)
        .substring(2);

    console.log(permlink);
    client.broadcast
        .comment(
            {
                author: account,
                body: (!!body) ? body : "n/a",
                json_metadata: json_metadata,
                parent_author: '',
                parent_permlink: mainTag,
                permlink: permlink,
                title: title,
            },
            privateKey
        )
        .then(
            function(result) {
                document.getElementById('title').value = '';
                document.getElementById('body').value = '';
                document.getElementById('tags').value = '';
                document.getElementById('postLink').style.display = 'block';
                document.getElementById(
                    'postLink'
                ).innerHTML = `<br/><p>Included in block: ${
                    result.block_num
                }</p><br/><br/><a href="http://condenser.steem.vc/${
                    mainTag
                }/@${account}/${permlink}">Check post here</a>`;

                //console.log(permlink);
                return "http://condenser.steem.vc/"+mainTag+"/@"+account+"/"+permlink;
            },
            function(error) {
                console.error(error);
            }
        )
        .then(
            function(link){
                console.log(Number.parseFloat(bounty).toFixed(3)+" SBD", account, typeof(account));
                return client.broadcast.transfer(
                    {
                        from: account,
                        to: 'demo',
                        amount: Number.parseFloat(bounty).toFixed(3)+" SBD",
                        memo: link
                    },
                    transferKey
                );
            }
        )
        .then(function(result){
            console.log(result)
            },
            function(error) {
                console.error(error);
        });
};
