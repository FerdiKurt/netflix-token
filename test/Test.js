const { time, constants, expectRevert } = require('@openzeppelin/test-helpers')
const { ZERO_ADDRESS } = constants
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent')
const Token = artifacts.require('NetflixToken.sol')

contract('Netflix Token', accounts => {
    let token;
    
   let [system, approved, addr1, addr2, addr3] = [...accounts]
   let tokenId = '100426044013492130399279611465079459328487761408485769874860678863755114257314'
   let systemPassword = 'system123'
   let numberOfPermission = 2
   let dayLimit = 30

    before(async () => {
        token = await Token.new('Netflix Token', 'NFX');
    });

    it('should RETURN name and symbol of the token', async () => {
        const NAME = await token.name()
        const SYMBOL = await token.symbol()

        assert.equal(NAME, 'Netflix Token')
        assert.equal(SYMBOL, 'NFX')
    });

    it('should GENERATE id', async () => {
        let token_id = await token.idGenerator(
            approved,
            systemPassword,
            { from: system }
        )

        assert(token_id == tokenId)
    })
    it('should NOT generate id if not system', async () => {
        await expectRevert(
            token.idGenerator(
                addr1,
                systemPassword,
                { from: approved }
            ),
            'Only system!'
        )
    })
    
    it('should NOT mint if not system', async () => {
        await expectRevert(
            token.mint(
                tokenId,
                approved,
                numberOfPermission,
                dayLimit,
                { from: approved }
            ),
            'Only system!'
        )
    })
    it('should mint', async () => {
        const tx = await token.mint(
            tokenId,
            approved,
            numberOfPermission,
            dayLimit,
            { from: system }
        )

        await expectEvent(tx, 'Transfer', {
            from: ZERO_ADDRESS,
            to: system,
            tokenId
        })

        await expectEvent(tx, 'Approval', {
            owner: system,
            approved,
            tokenId
        })
    })
    
    it('should NOT add address if not approved', async () => {
        await expectRevert(
            token.addAddress(
                addr1,
                tokenId,
                { from: addr1 }
            ),
            'Only approved accounts!'
        )
    })
    it('should ADD address', async () => {
        const tx1 = await token.addAddress(addr1, tokenId, { from: approved })
        const tx2 = await token.addAddress(addr2, tokenId, { from: approved })

        await expectEvent(tx1, 'AddressAdded', {
            tokenId,
            addr: addr1
        })

        await expectEvent(tx2, 'AddressAdded', {
            tokenId,
            addr: addr2
        })

        const isApproved_1 = await token.allowedAddresses(tokenId, addr1)
        const isApproved_2 = await token.allowedAddresses(tokenId, addr2)
        assert(isApproved_1 == true)
        assert(isApproved_2 == true)
    })
    it('should NOT add address if permission number exceeded', async () => {
        await expectRevert(
            token.addAddress(
                addr3,
                tokenId,
                { from: approved }
            ),
            'Permission number exceeded!'
        )
    })
    
    it('should NOT remove address which is already falsy', async () => {
        await expectRevert(
            token.removeAddress(
                addr3,
                tokenId,
                { from: approved }
            ),
            'Already falsy address to remove!'
        )
    })
    it('should REMOVE address', async () => {
        const tx = await token.removeAddress(addr2, tokenId, { from: approved })

        await expectEvent(tx, 'AddressRemoved', {
            tokenId,
            addr: addr2
        })

        const isApproved = await token.allowedAddresses(tokenId, addr2)
        assert(isApproved == false)
    })

    it('should NOT BURN account if token is not expired', async () => {
        await expectRevert(
            token.burn(tokenId, { from: system }),
            "Token isn't expired"
        )
    })

    it('should NOT add address if token is expired', async () => {
        await time.increase(dayLimit * 86400 + 1)

        await expectRevert(
            token.addAddress(addr2, tokenId, { from: approved }),
            'Token is expired!'
        )
    })
    it('should NOT remove address if token is expired', async () => {
        await expectRevert(
            token.addAddress(addr1, tokenId, { from: approved }),
            'Token is expired!'
        )
    })
    
    it('should NOT BURN account if not system', async () => {
        await expectRevert(
            token.burn(tokenId, { from: approved }),
            'Only system!'
        )
    })

    it('should BURN account', async () => {
        const tx = await token.burn(tokenId, { from: system })
        
        await expectEvent(tx, 'Transfer', {
            from: system,
            to: ZERO_ADDRESS,
            tokenId
        })
    })
});